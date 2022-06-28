import { Cancel, Save } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import { Box, Button, Paper, Stack, Theme, useMediaQuery } from '@mui/material';
import { addDays, nextSaturday, startOfDay } from 'date-fns';
import type { AdminEvent, EventClass, EventState, Judge, Official, Organizer } from 'koekalenteri-shared/model';
import { action, runInAction } from 'mobx';
import { observer } from 'mobx-react-lite';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AutocompleteSingle } from '../..';
import { CAdminEvent } from '../../../stores/classes';
import { BasicInfoSection } from './1.BasicInfoSection';
import { JudgesSection } from './2.JudgesSection';
import { EntrySection } from './3.EntrySection';
import { PaymentSection } from './4.PaymentSection';
import { HeadquartersSection } from './5.HeadquartersSection';
import { ContactInfoSection } from './6.ContactInfoSection';
import { AdditionalInfoSection } from './7.AdditionalInfoSection';
import { requiredFields, validateEvent } from './validation';

export type FormEventHandler = (event: Partial<AdminEvent>) => Promise<boolean>;
export type PartialEvent = Partial<AdminEvent> & { startDate: Date, endDate: Date, classes: EventClass[], judges: Judge[] };
type EventFormParams = {
  event: CAdminEvent
  eventTypes: string[]
  onSave: FormEventHandler
  onCancel: FormEventHandler
};

export const EventForm = observer(function EventForm({ event, eventTypes, onSave, onCancel }: EventFormParams) {
  const md = useMediaQuery((theme: Theme) => theme.breakpoints.up('md'));
  const { t } = useTranslation();
  const [saving, setSaving] = useState(false);
  const [changes, setChanges] = useState(typeof event.id === 'undefined');
  const [errors, setErrors] = useState(validateEvent(event));
  const [open, setOpen] = useState<{[key: string]: boolean|undefined}>({
    basic: true,
    judges: md,
    entry: md,
    payment: md,
    hq: md,
    contact: md,
    info: md
  });
  const valid = errors.length === 0;
  const fields = useMemo(() => requiredFields(event), [event]);
  const onChange = (props: Partial<AdminEvent>) => {
    // const tmp: any = {};
    // Object.keys(props).forEach(k => {tmp[k] = (local as any)[k]});
    // console.log('changed: ' + JSON.stringify(props), JSON.stringify(tmp));
    /*
    if (props.eventType && (eventTypeClasses[props.eventType] || []).length === 0) {
      props.classes = [];
    }
    */
    runInAction(() => {
      Object.assign(event, props);
      setErrors(validateEvent(event));
      setChanges(true);
    });
  }
  const saveHandler = async () => {
    setSaving(true);
    if ((await onSave(event)) === false) {
      setSaving(false);
    }
  }
  const cancelHandler = () => onCancel(event);
  const handleOpenChange = (id: keyof typeof open, value: boolean) => {
    const newState = md
      ? {
        ...open,
        [id]: value
      }
      : {
        basic: false,
        judges: false,
        entry: false,
        payment: false,
        hq: false,
        contact: false,
        info: false,
        [id]: value
      };
    setOpen(newState);
  }

  const errorStates: { [Property in keyof AdminEvent]?: boolean } = {};
  const helperTexts: { [Property in keyof AdminEvent]?: string } = {};
  for (const error of errors) {
    helperTexts[error.opts.field] = t(`validation.event.${error.key}`, error.opts);
    errorStates[error.opts.field] = true;
  }

  return (
    <Paper elevation={2} sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, overflow: 'auto', maxHeight: '100%', maxWidth: '100%' }}>
      <Box sx={{ p: 1 }}>
        <AutocompleteSingle
          disableClearable
          getOptionLabel={o => t(`event.states.${o}`)}
          label={t('event.state')}
          onChange={(e, value) => onChange({state: value || undefined})}
          options={['draft', 'tentative', 'confirmed', 'cancelled'] as EventState[]}
          value={event.state}
          sx={{width: 200}}
        />
      </Box>

      <Box sx={{ pb: 0.5, overflow: 'auto', bgcolor: 'background.form', '& .MuiInputBase-root': { bgcolor: 'background.default'} }}>
        <BasicInfoSection
          errorStates={errorStates}
          event={event}
          eventTypes={eventTypes}
          fields={fields}
          helperTexts={helperTexts}
          onChange={onChange}
          onOpenChange={(value) => handleOpenChange('basic', value)}
          open={open.basic}
        />
        <JudgesSection
          event={event}
          fields={fields}
          onChange={onChange}
          onOpenChange={(value) => handleOpenChange('judges', value)}
          open={open.judges}
        />
        <EntrySection
          event={event}
          fields={fields}
          errorStates={errorStates}
          helperTexts={helperTexts}
          onChange={onChange}
          onOpenChange={(value) => handleOpenChange('entry', value)}
          open={open.entry}
        />
        <PaymentSection
          event={event}
          fields={fields}
          onChange={onChange}
          onOpenChange={(value) => handleOpenChange('payment', value)}
          open={open.payment}
        />
        <HeadquartersSection
          event={event}
          onChange={onChange}
          onOpenChange={(value) => handleOpenChange('hq', value)}
          open={open.hq}
        />
        <ContactInfoSection
          event={event}
          errorStates={errorStates}
          helperTexts={helperTexts}
          fields={fields}
          onChange={onChange}
          onOpenChange={(value) => handleOpenChange('contact', value)}
          open={open.contact}
        />
        <AdditionalInfoSection
          event={event}
          onChange={onChange}
          onOpenChange={(value) => handleOpenChange('info', value)}
          open={open.info}
        />
      </Box>

      <Stack spacing={1} direction="row" justifyContent="flex-end" sx={{p: 1, borderTop: '1px solid', borderColor: '#bdbdbd'}}>
        <LoadingButton color="primary" disabled={!changes || !valid} loading={saving} loadingPosition="start" startIcon={<Save />} variant="contained" onClick={saveHandler}>Tallenna</LoadingButton>
        <Button startIcon={<Cancel />} variant="outlined" onClick={cancelHandler}>Peruuta</Button>
      </Stack>
    </Paper>
  );
})
