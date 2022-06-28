import { CircularProgress } from '@mui/material';
import { autorun } from 'mobx';
import { observer } from 'mobx-react-lite';
import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { EventForm } from '../../components';
import { ADMIN_EVENTS } from '../../config';
import { useStores } from '../../stores';
import { CAdminEvent } from '../../stores/classes';
import { AuthPage } from './AuthPage';

export const EventEditPage = observer(function EventEditPage({create}: {create?: boolean}) {
  const params = useParams();
  const { t } = useTranslation();
  const { rootStore } = useStores();
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const [event, setEvent] = useState<CAdminEvent>();
  const navigate = useNavigate();
  const title = create ? t('createEvent') : 'Muokkaa tapahtumaa';

  useEffect(() => autorun(() => {
    async function get(id: string) {
      if (!rootStore.adminEventStore.loaded) {
        await rootStore.adminEventStore.load();
      }
      const stored = rootStore.adminEventStore.find(id);
      const clone = new CAdminEvent(rootStore.adminEventStore);
      if (stored) {
        clone.updateFromJson(stored.toJSON());
      }
      setEvent(clone);
      setLoading(false);
    }
    if (!loading && (!event || event.id !== params.id)) {
      setLoading(true);
      if (params.id) {
        console.log(params);
        get(params.id);
      } else {
        console.log(params);
        setEvent(new CAdminEvent(rootStore.adminEventStore));
        setLoading(false);
      }
    }
  }), []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!event || loading) {
    return (
      <AuthPage title={title}>
        <CircularProgress />
      </AuthPage>
    )
  }

  return (
    <AuthPage title={title}>
      <EventForm
        event={event}
        eventTypes={rootStore.eventTypeStore.activeEventTypes.map(et => et.eventType)}
        onSave={async () => {
          try {
            await rootStore.adminEventStore.save(event)
            navigate(ADMIN_EVENTS);
            enqueueSnackbar(t(`event.states.${event.state || 'draft'}`, { context: 'save' }), { variant: 'info' });
            return Promise.resolve(true);
          } catch (e: any) {
            enqueueSnackbar(e.message, { variant: 'error' });
            return Promise.resolve(false);
          }
        }}
        onCancel={async () => {
          navigate(ADMIN_EVENTS, {});
          return Promise.resolve(true);
        }}
      />
    </AuthPage>
  )
})
