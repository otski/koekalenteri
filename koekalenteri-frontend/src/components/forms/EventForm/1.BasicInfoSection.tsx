import { Grid, TextField } from '@mui/material';
import { AdminEvent } from 'koekalenteri-shared/model';
import { observer } from 'mobx-react-lite';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CollapsibleSection, DateRange, HelpPopover } from '../..';
import { useStores } from '../../../stores';
import { CAdminEvent, CEventClass } from '../../../stores/classes';
import { EventClasses } from './EventClasses';
import { EventProperty } from './EventProperty';
import { FieldRequirements } from './validation';

type BasicInfoSectionParams = {
  event: CAdminEvent
  errorStates: { [Property in keyof AdminEvent]?: boolean }
  helperTexts: { [Property in keyof AdminEvent]?: string }
  fields: FieldRequirements
  eventTypes: string[]
  onChange: (props: Partial<AdminEvent>) => void
  open?: boolean
  onOpenChange?: (value: boolean) => void
};


export const BasicInfoSection = observer(function BasicInfoSection({ event, errorStates, helperTexts, fields, eventTypes, open, onOpenChange, onChange }: BasicInfoSectionParams) {
  const { t } = useTranslation();
  const { rootStore } = useStores();
  const [helpAnchorEl, setHelpAnchorEl] = useState<HTMLButtonElement | null>(null);

  return (
    <CollapsibleSection title="Kokeen perustiedot" open={open} onOpenChange={onOpenChange}>
      <Grid item container spacing={1}>
        <Grid item container spacing={1}>
          <Grid item sx={{ width: 600 }}>
            <DateRange
              startLabel={t('event.startDate')}
              endLabel={t('event.endDate')}
              start={event.startDate}
              end={event.endDate}
              required
              onChange={(start, end) => {
                event.setDates(start || undefined, end || undefined);
                onChange({});
              }}
            />
          </Grid>
          <Grid item sx={{ width: 300 }}>
            <EventProperty
              id="kcId"
              freeSolo
              event={event}
              fields={fields}
              options={[]}
              onChange={onChange}
              helpClick={(e) => setHelpAnchorEl(e.currentTarget)}
            />
            <HelpPopover anchorEl={helpAnchorEl} onClose={() => setHelpAnchorEl(null)}>{t('event.kcId_info')}</HelpPopover>
          </Grid>
        </Grid>
        <Grid item container spacing={1}>
          <Grid item sx={{ width: 300 }}>
            <EventProperty
              id="eventType"
              event={event}
              fields={fields}
              options={eventTypes}
              onChange={(props) => {
                event.setType(props.eventType || '');
                onChange({});
              }}
            />
          </Grid>
          <Grid item sx={{ width: 600 }}>
            <EventClasses
              id="class"
              event={event}
              required={fields.required.classes}
              errorStates={errorStates}
              helperTexts={helperTexts}
              requiredState={fields.state.classes}
              value={event.classes.map(c => ({ class: c.class, date: c.date, judge: c.judge?.toJSON() }))}
              classes={event.avalableClasses}
              label={t("event.classes")}
              onChange={(e, values) => {
                event.classes = values.map(v => new CEventClass({ date: v.date?.toISOString(), class: v.class }, rootStore.judgeStore));
                onChange({});
              }}
            />
          </Grid>
        </Grid>
        <Grid item container spacing={1}>
          <Grid item sx={{ width: 600 }}>
            <TextField label="Tapahtuman nimi" fullWidth value={event.name || ''} onChange={(e) => onChange({ name: e.target.value })} />
          </Grid>
        </Grid>
        <Grid item container spacing={1}>
          <Grid item sx={{ width: 600 }}>
            <EventProperty
              event={event}
              fields={fields}
              getOptionLabel={o => typeof o === 'string' ? o : o?.name || ''}
              id="organizer"
              isOptionEqualToValue={(o, v) => o?.id === v?.id}
              onChange={({ organizer }) => {
                onChange({ organizer: rootStore.organizerStore.getOrganizer(organizer?.id) });
              }}
              options={rootStore.organizerStore.organizers.map(o => ({id: o.id, name: o.name}))}
            />
          </Grid>
          <Grid item sx={{ width: 300 }}>
            <EventProperty
              event={event}
              fields={fields}
              freeSolo
              id="location"
              onChange={onChange}
              options={[]}
            />
          </Grid>
        </Grid>
        <Grid item container spacing={1}>
          <Grid item sx={{ width: 450 }}>
            <EventProperty
              event={event}
              fields={fields}
              getOptionLabel={o => typeof o === 'string' ? o : o?.name || ''}
              id="official"
              isOptionEqualToValue={(o, v) => o?.id === v?.id}
              onChange={({ official }) => {
                onChange({ official: rootStore.officialStore.getOfficial(official?.id) })
              }}
              options={rootStore.officialStore.filterByEventType(event.eventType).map(o => o.toJSON())}
            />
          </Grid>
          <Grid item sx={{ width: 450 }}>
            <EventProperty
              event={event}
              fields={fields}
              getOptionLabel={o => typeof o === 'string' ? o : o?.name || ''}
              id="secretary"
              isOptionEqualToValue={(o, v) => o?.id === v?.id}
              onChange={({ secretary }) => {
                onChange({ secretary: rootStore.officialStore.getOfficial(secretary?.id) })
              }}
              options={rootStore.officialStore.officials.map(o => o.toJSON())}
            />
          </Grid>
        </Grid>
      </Grid>
    </CollapsibleSection>
  );
});
