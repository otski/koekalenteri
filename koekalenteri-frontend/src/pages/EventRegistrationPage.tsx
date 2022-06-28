import { Box, CircularProgress, Grid, Paper, Toolbar, Typography } from '@mui/material';
import { autorun, runInAction } from 'mobx';
import { observer } from 'mobx-react-lite';
import { useSnackbar } from 'notistack';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { CollapsibleSection, CostInfo, LinkButton, RegistrationForm } from '../components';
import { getRegistrationDates } from '../components/forms/RegistrationForm/1.Entry';
import { Header } from '../layout';
import { useSessionStarted, useStores } from '../stores';
import { CEvent } from '../stores/classes';
import { CRegistration } from '../stores/classes/CRegistration';
import { entryDateColor } from '../utils';

export const EventRegistrationPage = observer(function EventRegistrationPage() {
  const params = useParams();
  const { rootStore } = useStores();
  const [sessionStarted] = useSessionStarted();
  const { t } = useTranslation();

  useEffect(() => {
    if (!rootStore.loaded) {
      rootStore.load();
    }
  }, []);

  useEffect(() => autorun(() => {
    const abort = new AbortController();
    async function get(eventType: string, id: string) {
      rootStore.eventStore.selectedEvent = await rootStore.eventStore.get(eventType, id, abort.signal);
    }
    if (params.eventType && params.id && rootStore.eventStore.selectedEvent?.id !== params.id) {
      get(params.eventType, params.id);
    }
    return () => abort.abort();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [params]);

  return (
    <>
      <Header title={t('entryTitle', { context: rootStore.eventStore.selectedEvent?.eventType === 'other' ? '' : 'test' })} />
      <Box sx={{ p: 1, overflow: 'hidden', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
        <Toolbar variant="dense" />{/* To allocate the space for fixed header */}
        <LinkButton sx={{mb: 1}} to="/" text={sessionStarted ? t('goBack') : t('goHome')} />
        {rootStore.eventStore.selectedEvent ? <EventComponent event={rootStore.eventStore.selectedEvent} classDate={params.date} className={params.class} /> : <CircularProgress />}
      </Box>
    </>
  )
})

const EventComponent = observer(function EventComponent({ event, classDate = '', className = '' }: { event: CEvent, classDate?: string, className?: string }) {
  const { enqueueSnackbar } = useSnackbar();
  const { rootStore } = useStores();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const onSave = async (registration: CRegistration) => {
    try {
      const result = await rootStore.registrationStore.save(registration);
      navigate('/', { replace: true });
      const emails = [result.handler.email];
      if (result.owner.email !== result.handler.email) {
        emails.push(result.owner.email);
      }
      enqueueSnackbar(t('registration.saved', { count: emails.length, to: emails.join("\n") }), { variant: 'success', style: { whiteSpace: 'pre-line' } });
      return true;
    } catch (e: any) {
      console.error(e);
      return false;
    }
  }
  const onCancel = async () => {
    navigate('/');
    return true;
  }
  useEffect(() => runInAction(() => {
    rootStore.registrationStore.registration.eventId = event.id;
    rootStore.registrationStore.registration.eventType = event.eventType;
    if (className) {
      rootStore.registrationStore.registration.class = className;
    }
    rootStore.registrationStore.registration.dates = getRegistrationDates(event, classDate, className);
  }));
  return (
    <>
      <Paper sx={{ p: 1, mb: 1, width: '100%' }} elevation={2}>
        <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>
          {event.eventType} {t('daterange', { start: event.startDate, end: event.endDate })} {event.location + (event.name ? ` (${event.name})` : '')}
        </Typography>
        <CollapsibleSection title="Kokeen tiedot">
          <Grid container justifyContent="space-between" alignItems="flex-start"
            sx={{ '& .MuiGrid-item': { overflow: 'hidden', textOverflow: 'ellipsis' } }}
          >
            <Grid item container sm={12} md columnSpacing={1}>
              <Grid item xs={4}>{t('entryTime')}:</Grid>
              <Grid item xs={8} sx={{ color: entryDateColor(event.isEntryOpen, event.isEntryClosing) }}>
                <b>{t('daterange', { start: event.entryStartDate, end: event.entryEndDate })}</b>&nbsp;
                {event.isEntryOpen ? t('distanceLeft', { date: event.entryEndDate }) : ''}
              </Grid>
              <Grid item xs={4}>{t('event.organizer')}:</Grid>
              <Grid item xs={8}>{event.organizer?.name}</Grid>
              <Grid item xs={4}>{t('event.judges')}:</Grid>
              <Grid item xs={8}>{event.judges.length > 0 && event.judges[0]?.name}</Grid>
              <Grid item xs={4}>{t('event.official')}:</Grid>
              <Grid item xs={8}>{event.official?.name || ''}</Grid>
            </Grid>
            <Grid item container sm={12} md columnSpacing={1}>
              <Grid item xs={4}>{t('event.paymentDetails')}:</Grid>
              <Grid item xs={8}><CostInfo event={event} /></Grid>
              <Grid item xs={4}>{t('event.description')}:</Grid>
              <Grid item xs={8}>{event.description}</Grid>
            </Grid>
          </Grid>
        </CollapsibleSection>
      </Paper>
      <RegistrationForm
        event={event}
        registration={rootStore.registrationStore.registration}
        className={className}
        classDate={classDate}
        onSave={onSave}
        onCancel={onCancel}
      />
    </>
  );
})
