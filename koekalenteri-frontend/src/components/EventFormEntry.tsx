import { Checkbox, FormControlLabel, FormHelperText, Grid, Table, TableBody, TableCell, TableHead, TableRow, TextField, TextFieldProps } from '@mui/material';
import { eachDayOfInterval, isSameDay, sub } from 'date-fns';
import { Event, EventClass } from 'koekalenteri-shared/model';
import { useTranslation } from 'react-i18next';
import { CollapsibleSection, compareEventClass, DateRange, PartialEvent } from '.';
import { unique } from '../utils';
import { FieldRequirements, validateEventField } from './EventForm.validation';

export function EventFormEntry({ event, fields, onChange }: { event: PartialEvent, fields: FieldRequirements, onChange: (props: Partial<Event>) => void }) {
  const { t } = useTranslation('event');
  const errorStart = fields.required.entryStartDate && validateEventField(event, 'entryStartDate');
  const errorEnd = fields.required.entryEndDate && validateEventField(event, 'entryEndDate');
  const error = errorStart || errorEnd;
  const helperText = error ? t(error.key, { ...error.opts, state: fields.state[error.opts.field] || 'draft' }) : '';

  return (
    <CollapsibleSection title="Ilmoittautuminen">
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
              range={{start: event.createdAt || sub(event.startDate, {weeks: 9}), end: event.startDate}}
              required={fields.required.entryStartDate || fields.required.entryEndDate}
              onChange={(start, end) => onChange({entryStartDate: start || undefined, entryEndDate: end || undefined})}
            />
            <FormHelperText error>{helperText}</FormHelperText>
          </Grid>
        </Grid>
        <Grid item container spacing={1}>
          <Grid item>
            Koepaikkojen määrä
            <EventFormPlaces event={event} fields={fields} onChange={onChange} />
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
}

const validValue = (s: string) => {
  let value = +s;
  if (value < 0) {
    value = 0;
  }
  if (value > 200) {
    value = 200;
  }
  return value;
};

function EventFormPlaces({ event, fields, onChange } : { event: PartialEvent, fields: FieldRequirements, onChange: (props: Partial<Event>) => void; }) {
  const { t } = useTranslation();
  const { t: te } = useTranslation('event');
  const days = eachDayOfInterval({
    start: event.startDate,
    end: event.endDate
  });
  const uniqueClasses = unique(event.classes.map(c => c.class));
  const classesByDays = days.map(day => ({ day, classes: event.classes.filter(c => isSameDay(c.date || event.startDate, day)) }));
  const handleChange = (c: EventClass) => (e: { target: { value: any; }; }) => {
    const newClasses = [...event.classes];
    const cls = newClasses.find(ec => compareEventClass(ec, c) === 0);
    if (cls) {
      cls.places = validValue(e.target.value);
    }
    const total = newClasses.reduce((prev, cur) => prev + (cur?.places || 0), 0);
    onChange({ classes: newClasses, places: total ? total : event.places });
  };
  const error = fields.required.places && validateEventField(event, 'places');
  const helperText = error ? te(error.key, { ...error.opts, state: fields.state.places || 'draft' }) : '';

  return (
    <>
      <Table size="small" sx={{ '& .MuiTextField-root': { m: 0, width: '10ch' } }} >
        <TableHead>
          <TableRow>
            <TableCell>{t('date')}</TableCell>
            {uniqueClasses.map(c => <TableCell key={`head${c}`} align='center'>{c}</TableCell>)}
            <TableCell align="center">Yhteensä</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {classesByDays.map(({ day, classes }) => {
            let dayTotal = 0;
            return (
              <TableRow key={day.toISOString()}>
                <TableCell component="th" scope="row">{t('dateshort', { date: day })}</TableCell>
                {uniqueClasses.map(c => {
                  const cls = classes.find(cl => cl.class === c);
                  dayTotal += cls?.places || 0;
                  return <TableCell key={c} align="center">{cls ? <PlacesInput value={cls.places} onChange={handleChange(cls)} /> : ''}</TableCell>
                })}
                <TableCell align="center"><PlacesDisplay value={dayTotal} /></TableCell>
              </TableRow>
            );
          })}
          <TableRow>
            <TableCell component="th" scope="row">Yhteensä</TableCell>
            {uniqueClasses.map(c => <TableCell align="center"><PlacesDisplay value={event.classes.filter(ec => ec.class === c).reduce((prev, cur) => prev + (cur?.places || 0), 0)} /></TableCell>)}
            <TableCell align="center">
              <PlacesInput
                value={event.places || ''}
                onChange={(e) => {
                  let value = +e.target.value;
                  if (value < 0) {
                    value = 0;
                  }
                  if (value > 999) {
                    value = 999;
                  }
                  const newClasses = [...event.classes];
                  for (const c of newClasses) {
                    c.places = 0;
                  }
                  onChange({ classes: newClasses, places: value });
                }}
              />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
      <FormHelperText error>{helperText}</FormHelperText>
    </>

  );
}

function PlacesInput(props: JSX.IntrinsicAttributes & TextFieldProps) {
  return (
    <TextField
      {...props}
      value={props.value === 0 ? '' : props.value}
      type="number"
      size="small"
      InputProps={{ inputProps: { min: 0, max: 999, style: {textAlign: 'right', padding: 4} } }}
    >
    </TextField>);
}

function PlacesDisplay({ value }: { value: number }) {
  return (<>{value === 0 ? '' : value}</>);
}