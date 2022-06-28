import { Checkbox, FormControlLabel, FormHelperText, Grid } from '@mui/material';
import { sub } from 'date-fns';
import { AdminEvent } from 'koekalenteri-shared/model';
import { observer } from 'mobx-react-lite';
import { CollapsibleSection, DateRange, PartialEvent } from '../..';
import { EventFormPlaces } from './EventFormPlaces';
import { FieldRequirements } from './validation';

export type EntrySectionProps = {
  event: PartialEvent
  fields: FieldRequirements
  errorStates: { [Property in keyof AdminEvent]?: boolean }
  helperTexts: { [Property in keyof AdminEvent]?: string }
  onChange: (props: Partial<AdminEvent>) => void
  onOpenChange?: (value: boolean) => void
  open?: boolean
}

export const EntrySection = observer(function EntrySection(props: EntrySectionProps) {
  const { event, fields, helperTexts, onChange, onOpenChange, open } = props;
  return (
    <CollapsibleSection title="Ilmoittautuminen" open={open} onOpenChange={onOpenChange}>
      <Grid item container spacing={1}>
        <Grid item container spacing={1}>
          <Grid item>
            <DateRange
              startLabel="Ilmoittautumisaika alkaa"
              endLabel="Ilmoittautumisaika päättyy"
              start={event.entryStartDate || null}
              defaultStart={sub(event.startDate, {weeks: 6})}
              end={event.entryEndDate || null}
              defaultEnd={sub(event.startDate, { weeks: 3 })}
              range={{ start: event.createdAt || sub(event.startDate, { weeks: 9 }), end: sub(event.startDate, { days: 1 })}}
              required={fields.required.entryStartDate || fields.required.entryEndDate}
              onChange={(start, end) => onChange({entryStartDate: start || undefined, entryEndDate: end || undefined})}
            />
            <FormHelperText error>{helperTexts.entryStartDate || helperTexts.entryEndDate}</FormHelperText>
          </Grid>
        </Grid>
        <Grid item container spacing={1}>
          <Grid item>
            Koepaikkojen määrä
            <EventFormPlaces {...props} />
          </Grid>
        </Grid>
        <Grid item container spacing={1}>
          <Grid item>
            <FormControlLabel
              control={
                <Checkbox
                  checked={!!event.allowOwnerMembershipPriority}
                  onChange={e => onChange({ allowOwnerMembershipPriority: e.target.checked })}
                />
              }
              label="Omistaja jäsenet etusijalla"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={!!event.allowHandlerMembershipPriority}
                  onChange={e => onChange({ allowHandlerMembershipPriority: e.target.checked })}
                />
              }
              label="Ohjaaja jäsenet etusijalla"
            />
          </Grid>
        </Grid>
      </Grid>
    </CollapsibleSection>
  );
})
