import { AddCircleOutline, ContentCopyOutlined, DeleteOutline, EditOutlined, FormatListNumberedOutlined } from '@mui/icons-material';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControlLabel, Stack, Switch, TextField } from '@mui/material';
import { AdminEvent } from 'koekalenteri-shared/model';
import cloneDeep from 'lodash.clonedeep';
import { autorun } from 'mobx';
import { observer } from 'mobx-react-lite';
import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { AutoButton, EventGrid } from '../../components';
import { ADMIN_EDIT_EVENT, ADMIN_NEW_EVENT, ADMIN_VIEW_EVENT } from '../../config';
import { FullPageFlex } from '../../layout';
import { useSessionStorage, useStores } from '../../stores';
import { AuthPage } from './AuthPage';

export const EventListPage = observer(function EventListPage() {
  const { t } = useTranslation();
  const { rootStore } = useStores();
  const { enqueueSnackbar } = useSnackbar();
  const [open, setOpen] = useState(false);
  const [selectedId] = useSessionStorage('adminEventId', '');
  const navigate = useNavigate();

  const handleClose = () => {
    setOpen(false);
  };

  const copyAction = async () => {
    if (rootStore.adminEventStore.selectedEvent) {
      const newEvent: Partial<AdminEvent> = cloneDeep({ ...rootStore.adminEventStore.selectedEvent });
      delete newEvent.id;
      delete newEvent.kcId;
      delete newEvent.state;
      delete newEvent.startDate;
      delete newEvent.endDate;
      delete newEvent.entryStartDate;
      delete newEvent.entryEndDate;
      rootStore.adminEventStore.newEvent = newEvent;
      navigate(ADMIN_NEW_EVENT);
    }
  }

  const deleteAction = async () => {
    if (selectedId) {
      setOpen(false);
      try {
        await rootStore.adminEventStore.deleteEvent(selectedId);
        enqueueSnackbar(t('deleteEventComplete'), { variant: 'info' });
      } catch (e: any) {
        enqueueSnackbar(e.message, { variant: 'error' });
      }
    }
  }

  useEffect(() => {
    autorun(() => {
      if (!rootStore.adminEventStore.loaded) {
        rootStore.adminEventStore.load();
      }
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <AuthPage title={t('events')}>
      <FullPageFlex>
        <TextField sx={{ mt: 2, width: '300px' }} size="small" label="Hae" variant="outlined" disabled />
        <div>
          <FormControlLabel
            sx={{ ml: 0, mb: 2 }}
            value="withUpcomingEntry"
            checked={true}
            disabled
            control={<Switch />}
            label="Näytä myös menneet tapahtumat"
            labelPlacement="start"
          />
        </div>
        <Stack direction="row" spacing={2}>
          <AutoButton startIcon={<AddCircleOutline />} onClick={() => navigate(ADMIN_NEW_EVENT)} text={t('createEvent')} />
          <AutoButton startIcon={<EditOutlined />} disabled={!selectedId} onClick={() => navigate(`${ADMIN_EDIT_EVENT}/${selectedId}`)} text={t('edit')} />
          <AutoButton startIcon={<ContentCopyOutlined />} disabled={!selectedId} onClick={copyAction} text={t('copy')} />
          <AutoButton startIcon={<DeleteOutline />} disabled={!selectedId} onClick={() => setOpen(true)} text={t('delete')} />
          <AutoButton startIcon={<FormatListNumberedOutlined />} disabled={!selectedId} onClick={() => navigate(`${ADMIN_VIEW_EVENT}/${selectedId}`)} text={t('registrations')} />
        </Stack>
        <EventGrid />
      </FullPageFlex>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">
          {t('deleteEventTitle')}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            {t('deleteEventText')}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>{t('cancel')}</Button>
          <Button onClick={deleteAction} autoFocus>{t('delete')}</Button>
        </DialogActions>
      </Dialog>
    </AuthPage>
  )
})
