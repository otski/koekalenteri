import { Checkbox, FormControlLabel, FormGroup, Grid, Switch, TextField } from '@mui/material';
import { action } from 'mobx';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import { CollapsibleSection } from '../..';
import { CRegistration } from '../../../stores/classes/CRegistration';

type OwnerInfoProps = {
  reg: CRegistration
  error?: boolean
  helperText?: string
  onOpenChange?: (value: boolean) => void
  open?: boolean
};

export const OwnerInfo = observer(function OwnerInfo({reg, error, helperText, onOpenChange, open}: OwnerInfoProps) {
  const { t } = useTranslation();

  return (
    <CollapsibleSection title={t('registration.owner')} error={error} helperText={helperText} open={open} onOpenChange={onOpenChange}>
      <Grid item container spacing={1}>
        <Grid item container spacing={1}>
          <Grid item sx={{ width: 300 }}>
            <TextField
              InputProps={{ autoComplete: 'name' }}
              error={!reg.owner.name}
              fullWidth
              id="owner_name"
              label={t('registration.contact.name')}
              name="name"
              onChange={action(e => { reg.owner = { ...reg.owner, name: e.target.value } })}
              value={reg.owner.name || ''}
            />
          </Grid>
          <Grid item sx={{ width: 300 }}>
            <TextField
              InputProps={{ autoComplete: 'address-level2' }}
              error={!reg.owner?.location}
              fullWidth
              id="owner_city"
              label={t('registration.contact.city')}
              name="city"
              onChange={action(e => { reg.owner = { ...reg.owner, location: e.target.value } })}
              value={reg.owner.location || ''}
            />
          </Grid>
        </Grid>
        <Grid item container spacing={1}>
          <Grid item sx={{ width: 300 }}>
            <TextField
              InputProps={{ autoComplete: 'email' }}
              error={!reg.owner?.email}
              fullWidth
              id="owner_email"
              label={t('registration.contact.email')}
              name="email"
              onChange={action(e => { reg.owner = { ...reg.owner, email: e.target.value } })}
              value={reg.owner.email || ''}
            />
          </Grid>
          <Grid item sx={{ width: 300 }}>
            <TextField
              InputProps={{ autoComplete: 'tel' }}
              error={!reg.owner?.phone}
              fullWidth
              id="owner_phone"
              label={t('registration.contact.phone')}
              name="phone"
              onChange={action(e => { reg.owner = { ...reg.owner, phone: e.target.value } })}
              value={reg.owner.phone || ''}
            />
          </Grid>
        </Grid>
      </Grid>
      <FormGroup>
        <FormControlLabel control={
          <Checkbox
            checked={!!reg.owner?.membership}
            onChange={e => { reg.owner = { ...reg.owner, membership: e.target.checked } }}
          />} label={t('registration.ownerIsMember')}
        />
      </FormGroup>
      <FormGroup>
        <FormControlLabel control={
          <Switch
            checked={!!reg.ownerHandles}
            onChange={action(e => { reg.ownerHandles = e.target.checked })}
          />
        } label={t('registration.ownerHandles')} />
      </FormGroup>
    </CollapsibleSection>
  );
})
