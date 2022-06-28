import { Grid } from '@mui/material';
import { eachDayOfInterval, format } from 'date-fns';
import { Event, Registration, RegistrationDate, ReserveChoise } from 'koekalenteri-shared/model';
import { autorun, runInAction, toJS } from 'mobx';
import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AutocompleteMulti, AutocompleteSingle, CollapsibleSection } from '../..';
import { unique, uniqueDate } from '../../../utils';

function getClassDates(event: Event, classDate: string|undefined, regClass: string|undefined) {
  const classes = event.classes.filter(c => typeof c !== 'string' && (regClass === '' || c.class === regClass));
  const dates = classes.length
    ? classes.map(c => c.date || event.startDate)
    : event.startDate <= event.endDate ? eachDayOfInterval({ start: event.startDate, end: event.endDate }) : [];
  if (classDate) {
    return dates.filter(d => format(d, 'dd.MM.') === classDate);
  }
  return uniqueDate(dates);
}

export function getRegistrationDates(event: Event, classDate: string | undefined, eventClass: string): RegistrationDate[] {
  return getClassDates(event, classDate, eventClass).flatMap((date) => [{ date, time: 'ap' }, { date, time: 'ip' }]);
}

type EntryInfoProps = {
  reg: Registration
  event: Event
  className?: string
  classDate?: string
  error?: boolean
  helperText?: string
  errorStates: { [Property in keyof Registration]?: boolean }
  helperTexts: { [Property in keyof Registration]?: string }
  onOpenChange?: (value: boolean) => void
  open?: boolean
}

export const EntryInfo = observer(function EntryInfo({ reg, event, className, classDate, errorStates, helperTexts, onOpenChange, open }: EntryInfoProps) {
  const { t } = useTranslation();
  const [helperText, setHelperText] = useState('');
  const [classDates, setClassDates] = useState<RegistrationDate[]>([]);
  const error = errorStates.class || errorStates.dates || errorStates.reserve;

  useEffect(() => autorun(() => {
    const datesText = reg.dates.map(o => t('weekday', { date: o.date }) + ' ' + t(`registration.time.${o.time}`)).join(' / ');
    const reserveText = reg.reserve ? t(`registration.reserveChoises.${reg.reserve}`) : '';
    const infoText = `${reg.class || reg.eventType}, ${datesText}, ${reserveText}`;
    setHelperText(error ? t('validation.registration.required', { field: 'classesDetails' }) : infoText);
  }), [event, error]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <CollapsibleSection
      title={t('registration.class')}
      border={false}
      error={error}
      helperText={helperText}
      open={open}
      onOpenChange={onOpenChange}
    >
      <Grid container spacing={1}>
        <Grid item sx={{ minWidth: 100, display: event.classes.length === 0 ? 'none' : 'block' }}>
          <AutocompleteSingle
            disableClearable
            disabled={!!className}
            error={errorStates.class}
            helperText={helperTexts.class}
            isOptionEqualToValue={(o, v) => o === v || v === ''}
            label={t("registration.class")}
            onChange={(_e, value) => runInAction(() => {
              const availableDates = getRegistrationDates(event, classDate, value);
              reg.class = value;
              if (reg.dates.length === classDates.length) {
                reg.dates = availableDates;
              } else {
                reg.dates = reg.dates.filter(d => availableDates.some(cd => cd.date.valueOf() === d.date.valueOf()));
              }
              setClassDates(availableDates);
            })}
            options={unique(event.classes.map(c => c.class))}
            value={reg.class}
          />
        </Grid>
        <Grid item>
          <AutocompleteMulti
            error={errorStates.dates}
            helperText={t("registration.datesInfo")}
            label={t("registration.dates")}
            onChange={(_e, value) => runInAction(() =>{ reg.dates = value; })}
            isOptionEqualToValue={(o, v) => o.date.valueOf() === v.date.valueOf() && o.time === v.time}
            getOptionLabel={o => t('weekday', { date: o.date }) + (o.time === 'ap' ? ' (aamu)' : ' (ilta)')}
            options={classDates}
            value={toJS(reg.dates)}
          />
        </Grid>
        <Grid item sx={{ width: 280 }}>
          <AutocompleteSingle
            disableClearable
            error={errorStates.reserve}
            helperText={helperTexts.reserve}
            label={t('registration.reserve')}
            onChange={(_e, value) => runInAction(() =>{ reg.reserve = value })}
            getOptionLabel={o => o !== '' ? t(`registration.reserveChoises.${o}`) : ''}
            options={['ANY', 'DAY', 'WEEK', 'NO'] as ReserveChoise[]}
            value={reg.reserve}
          />
        </Grid>
      </Grid>
    </CollapsibleSection>
  );
})
