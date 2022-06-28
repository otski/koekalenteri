import { Cancel, Save } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import { Box, Button, Checkbox, Collapse, FormControl, FormControlLabel, FormHelperText, Link, Paper, Stack, Theme, useMediaQuery } from '@mui/material';
import { Event, Registration } from 'koekalenteri-shared/model';
import { autorun } from 'mobx';
import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useStores } from '../../../stores';
import { CRegistration } from '../../../stores/classes/CRegistration';
import { ValidationError } from '../validation';
import { EntryInfo, getRegistrationDates } from './1.Entry';
import { DogInfo } from './2.Dog';
import { BreederInfo } from './3.Breeder';
import { OwnerInfo } from './4.OwnerInfo';
import { HandlerInfo } from './5.HandlerInfo';
import { QualifyingResultsInfo } from './6.QualifyingResultsInfo';
import { AdditionalInfo } from './7.AdditionalInfo';
import { RegistrationClass } from '../../../rules';
import { filterRelevantResults, validateRegistration } from './validation';

type FormEventHandler = (registration: CRegistration) => Promise<boolean>;
type RegistrationFormProps = {
  event: Event
  registration: CRegistration
  className?: string
  classDate?: string
  onSave?: FormEventHandler
  onCancel?: FormEventHandler
};

export const emptyDog = {
  regNo: '',
  refreshDate: undefined,
  results: []
};
export const emptyBreeder = {
  name: '',
  location: ''
};
export const emptyPerson = {
  name: '',
  phone: '',
  email: '',
  location: '',
  membership: false
};

export const RegistrationForm = observer(function RegistrationForm({ event, registration, className, classDate, onSave, onCancel }: RegistrationFormProps) {
  const { rootStore } = useStores();
  const eventHasClasses = (rootStore.eventTypeClasses[event.eventType] || []).length > 0;
  const large = useMediaQuery((theme: Theme) => theme.breakpoints.up('md'));
  const { t } = useTranslation();
  const [qualifies, setQualifies] = useState<boolean | null>(registration.id ? filterRelevantResults(event, registration.class as RegistrationClass, registration.dog?.results).qualifies : null);
  const [saving, setSaving] = useState(false);
  const [changes, setChanges] = useState(registration.id === '');
  const [errors, setErrors] = useState<ValidationError<Registration, "registration">[]>([]);
  const [open, setOpen] = useState<{ [key: string]: boolean | undefined }>({});
  const valid = errors.length === 0;
  const onChange = (props: Partial<Registration>) => {
    console.log('Changes: ' + JSON.stringify(props));
    if (props.class && !props.dates) {
      const allCount = getRegistrationDates(event, classDate, registration.class || '').length;
      const available = getRegistrationDates(event, classDate, props.class);
      if (registration.dates.length === allCount) {
        registration.dates = available;
      } else {
        props.dates = registration.dates.filter(rd => available.find(a => a.date.valueOf() === rd.date.valueOf() && a.time === rd.time));
      }
    }
    setChanges(true);
    setSaving(false);
  }
  const saveHandler = async () => {
    setSaving(true);
    if (onSave && (await onSave(registration)) === false) {
      setSaving(false);
    }
  }
  const cancelHandler = () => onCancel && onCancel(registration);
  const handleOpenChange = (id: keyof typeof open, value: boolean) => {
    const newState = large
      ? {
        ...open,
        [id]: value
      }
      : {
        entry: false,
        dog: false,
        breeder: false,
        owner: false,
        handler: registration.ownerHandles,
        qr: false,
        info: false,
        [id]: value
      };
    setOpen(newState);
  }
  const errorStates: { [Property in keyof Registration]?: boolean } = {};
  const helperTexts: { [Property in keyof Registration]?: string } = {
    breeder: `${registration.breeder?.name || ''}`,
    dog: !registration.dog ? '' : `${registration.dog.regNo} - ${registration.dog.name}`,
    handler: !registration.handler ? '' : registration.handler.name === registration.owner.name ? t('registration.ownerHandles') : `${registration.handler.name}`,
    owner: !registration.owner ? '' : `${registration.owner.name}`,
    qualifyingResults: qualifies === null ? '' : t('registration.qualifyingResultsInfo', { qualifies: t(qualifies ? 'registration.qyalifyingResultsYes' : 'registration.qualifyingResultsNo') }),
  };
  for (const error of errors) {
    helperTexts[error.opts.field] = t(`validation.registration.${error.key}`, error.opts);
    errorStates[error.opts.field] = true;
  }

  useEffect(() => {
    setOpen({
      entry: true,
      dog: large,
      breeder: large,
      owner: large,
      handler: large,
      qr: large,
      info: large
    });
  }, [large]);

  useEffect(() => autorun(() => {
    setErrors(validateRegistration(registration, event));
    const c = registration.class;
    const dog = registration.dog;
    const filtered = filterRelevantResults(event, c as RegistrationClass, dog?.results, registration.results);
    setQualifies((!dog?.regNo || (eventHasClasses && !c)) ? null : filtered.qualifies);
    //registration.qualifyingResults = filtered.relevant;

  }), []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Paper elevation={2} sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, overflow: 'auto', maxHeight: '100%', maxWidth: '100%' }}>
      <Box sx={{
        pb: 0.5,
        overflow: 'auto',
        borderRadius: 1,
        bgcolor: 'background.form',
        '& .MuiInputBase-root': {
          bgcolor: 'background.default'
        },
        '& .fact input.Mui-disabled': {
          color: 'success.main',
          'WebkitTextFillColor': 'inherit'
        }
      }}>
        <EntryInfo
          reg={registration}
          event={event}
          className={className}
          classDate={classDate}
          errorStates={errorStates}
          helperTexts={helperTexts}
          onOpenChange={(value) => handleOpenChange('entry', value)}
          open={open.entry}
        />
        <DogInfo
          reg={registration}
          eventDate={event.startDate}
          minDogAgeMonths={9}
          error={errorStates.dog}
          helperText={helperTexts.dog}
          onOpenChange={(value) => handleOpenChange('dog', value)}
          open={open.dog}
        />
        <BreederInfo
          reg={registration}
          error={errorStates.breeder}
          helperText={helperTexts.breeder}
          onOpenChange={(value) => handleOpenChange('breeder', value)}
          open={open.breeder}
        />
        <OwnerInfo
          reg={registration}
          error={errorStates.owner}
          helperText={helperTexts.owner}
          onOpenChange={(value) => handleOpenChange('owner', value)}
          open={open.owner}
        />
        <Collapse in={!registration.ownerHandles}>
          <HandlerInfo
            reg={registration}
            error={errorStates.handler}
            helperText={helperTexts.handler}
            onOpenChange={(value) => handleOpenChange('handler', value)}
            open={open.handler}
          />
        </Collapse>
        <QualifyingResultsInfo
          reg={registration}
          error={!qualifies}
          helperText={helperTexts.qualifyingResults}
          onChange={onChange}
          onOpenChange={(value) => handleOpenChange('qr', value)}
          open={open.qr}
        />
        <AdditionalInfo
          reg={registration}
          onOpenChange={(value) => handleOpenChange('info', value)}
          open={open.info}
        />
        <Box sx={{ m: 1, mt: 2, ml: 4, borderTop: '1px solid #bdbdbd' }}>
          <FormControl error={errorStates.agreeToTerms} disabled={!!registration.id}>
            <FormControlLabel control={<Checkbox checked={registration.agreeToTerms} onChange={e => {
              registration.agreeToTerms = e.target.checked;
            }} />} label={
              <>
                <span>{t('registration.terms.read')}</span>&nbsp;
                <Link target="_blank" rel="noopener" href="https://yttmk.yhdistysavain.fi/noutajien-metsastyskokeet-2/ohjeistukset/kokeen-ja-tai-kilpailun-ilmoitta/">{t('registration.terms.terms')}</Link>
                &nbsp;<span>{t('registration.terms.agree')}</span>
              </>
            } />
          </FormControl>
          <FormHelperText error>{helperTexts.agreeToTerms}</FormHelperText>
          <FormControl error={errorStates.agreeToPublish} disabled={!!registration.id}>
            <FormControlLabel control={<Checkbox checked={registration.agreeToPublish} onChange={e => {
              registration.agreeToPublish = e.target.checked
            }} />} label={t('registration.terms.publish')} />
          </FormControl>
          <FormHelperText error>{helperTexts.agreeToPublish}</FormHelperText>
        </Box>
      </Box>

      <Stack spacing={1} direction="row" justifyContent="flex-end" sx={{ p: 1, borderTop: '1px solid', borderColor: '#bdbdbd' }}>
        <LoadingButton color="primary" disabled={!changes || !valid} loading={saving} loadingPosition="start" startIcon={<Save />} variant="contained" onClick={saveHandler}>Tallenna</LoadingButton>
        <Button startIcon={<Cancel />} variant="outlined" onClick={cancelHandler}>Peruuta</Button>
      </Stack>
    </Paper>
  );
})
