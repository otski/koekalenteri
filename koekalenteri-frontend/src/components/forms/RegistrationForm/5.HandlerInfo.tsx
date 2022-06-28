import { Checkbox, FormControlLabel, Grid, TextField } from '@mui/material';
import { action } from 'mobx';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import { CollapsibleSection } from '../..';
import { CRegistration } from '../../../stores/classes/CRegistration';

type HandlerInfoProps = {
  reg: CRegistration
  error?: boolean
  helperText?: string
  onOpenChange?: (value: boolean) => void
  open?: boolean
};

export const HandlerInfo = observer(function HandlerInfo({ reg, error, helperText, onOpenChange, open }: HandlerInfoProps) {
  const { t } = useTranslation();

  return (
    <CollapsibleSection title={t('registration.handler')} error={error} helperText={helperText} open={open} onOpenChange={onOpenChange}>
      <Grid item container spacing={1}>
        <Grid item container spacing={1}>
          <Grid item sx={{ width: 300 }}>
            <TextField
              InputProps={{ autoComplete: 'name' }}
              error={!reg.handler?.name}
              fullWidth
              id="handler_name"
              label={t('registration.contact.name')}
              name="name"
              onChange={action(e => { reg.handler = { ...reg.handler, name: e.target.value } })}
              value={reg.handler.name || ''}
            />
          </Grid>
          <Grid item sx={{ width: 300 }}>
            <TextField
              InputProps={{ autoComplete: 'address-level2' }}
              error={!reg.handler?.location}
              fullWidth
              id="handler_city"
              name="city"
              onChange={action(e => { reg.handler = { ...reg.handler, location: e.target.value } })}
              label={t('registration.contact.city')}
              value={reg.handler?.location || ''}
            />
          </Grid>
        </Grid>
        <Grid item container spacing={1}>
          <Grid item sx={{ width: 300 }}>
            <TextField
              InputProps={{ autoComplete: 'email' }}
              error={!reg.handler?.email}
              fullWidth
              id="handler_email"
              label={t('registration.contact.email')}
              name="email"
              onChange={action(e => { reg.handler = { ...reg.handler, email: e.target.value } })}
              value={reg.handler?.email || ''}
            />
          </Grid>
          <Grid item sx={{ width: 300 }}>
            <TextField
              InputProps={{ autoComplete: 'tel' }}
              error={!reg.handler?.phone}
              fullWidth
              id="handler_phone"
              label={t('registration.contact.phone')}
              name="phone"
              onChange={action(e => { reg.handler = { ...reg.handler, phone: e.target.value } })}
              value={reg.handler?.phone || ''}
            />
          </Grid>
        </Grid>
      </Grid>
      <FormControlLabel
        control={
          <Checkbox
            checked={!!reg.handler?.membership}
            onChange={action(e => { reg.handler = { ...reg.handler, membership: e.target.checked } })}
          />
        }
        label={t('registration.handlerIsMember')}
      />
    </CollapsibleSection>
  );
})
