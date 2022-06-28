import { AddCircleOutline, DeleteOutline, EditOutlined, EuroOutlined, PersonOutline } from '@mui/icons-material';
import { Box, Button, Dialog, DialogContent, DialogTitle, Grid, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { GridColDef, GridSelectionModel } from '@mui/x-data-grid';
import { format } from 'date-fns';
import { BreedCode } from 'koekalenteri-shared/model';
import { toJS } from 'mobx';
import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { CollapsibleSection, LinkButton, RegistrationForm, StyledDataGrid } from '../../components';
import { ADMIN_EVENTS } from '../../config';
import { FullPageFlex } from '../../layout';
import { useStores } from '../../stores';
import { CAdminEvent } from '../../stores/classes/CAdminEvent';
import { CRegistration } from '../../stores/classes/CRegistration';
import { AuthPage } from './AuthPage';


export const EventViewPage = observer(function EventViewPage() {
  const params = useParams();
  const { t } = useTranslation();
  const { t: breed } = useTranslation('breed');
  const { rootStore } = useStores();
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<CRegistration>();

  useEffect(() => {
    if (!loading) {
      return;
    }
    const abort = new AbortController();
    async function get(id: string) {
      if (!rootStore.adminEventStore.loaded) {
        await rootStore.adminEventStore.load();
      }
      const loadedEvent = rootStore.adminEventStore.find(id);
      if (rootStore.adminEventStore.selectedEvent?.id !== loadedEvent?.id) {
        rootStore.adminEventStore.selectedEvent = loadedEvent;
      }
      //const items = await getRegistrations(id, abort.signal);
      //setRegistrations(items);
      setLoading(false);
    }
    if (params.id) {
      get(params.id);
    } else {
      setLoading(false);
    }
    return () => abort.abort();
  }, [params, rootStore, loading]);

  const event = rootStore.adminEventStore.selectedEvent;
  if (!event) {
    return <div>No event selected</div>
  }

  const columns: GridColDef[] = [
    {
      field: 'dog.name',
      headerName: t('dog.name'),
      width: 250,
      flex: 1,
      valueGetter: (p) => p.row.dog.name
    },
    {
      field: 'dog.regNo',
      headerName: t('dog.regNo'),
      width: 130,
      valueGetter: (p) => p.row.dog.regNo
    },
    {
      field: 'dob.breed',
      headerName: t('dog.breed'),
      width: 150,
      valueGetter: (p) => breed(`${p.row.dog.breedCode as BreedCode}`)
    },
    {
      field: 'class',
      width: 90,
      headerName: t('eventClass'),
    },
    {
      field: 'handler',
      headerName: t('registration.handler'),
      width: 150,
      flex: 1,
      valueGetter: (p) => p.row.handler.name
    },
    {
      field: 'createdAt',
      headerName: t('registration.createdAt'),
      width: 140,
      valueGetter: (p) => t('dateTimeShort', { date: p.value })
    },
    {
      field: 'member',
      headerName: t('registration.member'),
      width: 60,
      align: 'center',
      renderCell: (p) => (p.row.handler.membership ? <PersonOutline fontSize="small" /> : <></>)
    },
    {
      field: 'paid',
      headerName: t('registration.paid'),
      width: 90,
      align: 'center',
      renderCell: () => (<EuroOutlined fontSize="small" />)
    }
  ];

  return (
    <AuthPage>
      <FullPageFlex>
        <Grid container justifyContent="space-between">
          <Grid item xs>
            <LinkButton sx={{ mb: 1 }} to={ADMIN_EVENTS} text={t('goBack')} />
            <Title event={event} />
            <CollapsibleSection title="Kokeen tiedot" initOpen={false}>
              Kokeen tarkat tiedot tähän...
            </CollapsibleSection>
            Filttereitä tähän...
          </Grid>
          <Grid item xs="auto">
            <InfoPanel event={event} />
          </Grid>
        </Grid>
        <Stack direction="row" spacing={2}>
          <Button startIcon={<AddCircleOutline />} onClick={() => { setSelected(undefined); setOpen(true); }}>{t('create')}</Button>
          <Button startIcon={<EditOutlined />} disabled={!selected} onClick={() => setOpen(true)}>{t('edit')}</Button>
          <Button startIcon={<DeleteOutline />} disabled>{t('delete')}</Button>
        </Stack>
        <StyledDataGrid
          loading={loading}
          autoPageSize
          columns={columns}
          density='compact'
          disableColumnMenu
          rows={toJS(event.registrations)}
          onSelectionModelChange={(selectionModel: GridSelectionModel) => setSelected(event.registrations.find(r => r.id === selectionModel[0]))}
          selectionModel={selected ? [selected.id] : []}
          onRowDoubleClick={() => setOpen(true)}
        />
      </FullPageFlex>
      <RegistrationDialog event={event} registration={selected} open={open} onClose={() => setOpen(false)} />
    </AuthPage>
  )
});

const RegistrationDialog = observer(function RegistrationDialog({ event, registration, open, onClose }: { event: CAdminEvent, registration?: CRegistration, open: boolean, onClose: () => void }) {
  const { t } = useTranslation();
  const onSave = async (registration: CRegistration) => {
    return false;
  }
  const onCancel = async (registration: CRegistration) => {
    onClose();
    return true;
  }
  if (!registration) {
    return <></>
  }
  return (
    <Dialog
      fullWidth
      maxWidth='lg'
      open={open}
      onClose={onClose}
      aria-labelledby="reg-dialog-title"
      PaperProps={{
        sx: {
          m: 1,
          maxHeight: 'calc(100% - 16px)',
          width: 'calc(100% - 16px)',
          '& .MuiDialogTitle-root': {
            fontSize: '1rem'
          }
        }
      }}
    >
      <DialogTitle id="reg-dialog-title">{registration.dog ? `${registration.dog.name} / ${registration.handler.name}` : t('create')}</DialogTitle>
      <DialogContent dividers sx={{ height: '100%', p: 0 }}>
        <RegistrationForm event={event} registration={registration} onSave={onSave} onCancel={onCancel} />
      </DialogContent>
    </Dialog>
  );
});

const Title = observer(function Title({ event }: { event: CAdminEvent }) {
  const { t } = useTranslation();
  return (
    <Typography variant="h5">
      {event.eventType}, {t('daterange', { start: event.startDate, end: event.endDate })}, {event.location}
      <Box sx={{ display: 'inline-block', mx: 2, color: '#018786' }}>{t('event.states.confirmed_entryOpen')}</Box>
    </Typography>
  );
})

const InfoPanel = observer(function InfoPanel({ event }: { event: CAdminEvent }) {
  const { t } = useTranslation();
  return (
    <TableContainer component={Paper} elevation={4} sx={{
      width: 256,
      backgroundColor: 'background.selected',
      p: 1,
      '& .MuiTableCell-root': {py: 0, px: 1}
    }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell colSpan={5}><b>Ilmoittautuneita</b></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {event.classes?.map(c =>
            <TableRow key={c.class + c.date?.toISOString()}>
              <TableCell>{format(c.date || event.startDate, t('dateformatS'))}</TableCell>
              <TableCell>{c.class}</TableCell>
              <TableCell align="right">{c.entries}</TableCell>
              <TableCell>Jäseniä</TableCell>
              <TableCell align="right">{c.members}</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
})
