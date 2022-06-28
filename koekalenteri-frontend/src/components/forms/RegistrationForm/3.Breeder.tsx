import { Grid, TextField } from '@mui/material';
import { runInAction } from 'mobx';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import { CollapsibleSection } from '../..';
import { CRegistration } from '../../../stores/classes/CRegistration';

type BreederInfoProps = {
  reg: CRegistration
  error?: boolean
  helperText?: string
  onOpenChange?: (value: boolean) => void
  open?: boolean
};

export const BreederInfo = observer(function BreederInfo({ reg, error, helperText, onOpenChange, open }: BreederInfoProps) {
  const { t } = useTranslation();

  return (
    <CollapsibleSection title={t('registration.breeder')} error={error} helperText={helperText} open={open} onOpenChange={onOpenChange}>
      <Grid item container spacing={1}>
        <Grid item>
          <TextField
            error={!reg.breeder.name}
            id="breeder_name"
            sx={{ width: 300 }}
            label="Nimi"
            value={reg.breeder.name || ''}
            onChange={e => {
              runInAction(() => {
                reg.breeder.name = e.target.value
              });
            }}
          />
        </Grid>
        <Grid item>
          <TextField
            error={!reg.breeder.location}
            id="breeder_location"
            sx={{ width: 300 }}
            label="Kotikunta"
            value={reg.breeder.location || ''}
            onChange={e => {
              runInAction(() => {
                reg.breeder.location = e.target.value
              });
            }}
          />
        </Grid>
      </Grid>
    </CollapsibleSection>
  );
})
