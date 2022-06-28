import { TextField } from '@mui/material';
import { Registration } from 'koekalenteri-shared/model';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import { CollapsibleSection } from '../..';

type AdditionalInfoProps = {
  reg: Registration
  onOpenChange?: (value: boolean) => void
  open?: boolean
};

export const AdditionalInfo = observer(function AdditionalInfo({reg, onOpenChange, open}: AdditionalInfoProps) {
  const { t } = useTranslation();

  return (
    <CollapsibleSection title={t('registration.notes')} open={open} onOpenChange={onOpenChange}>
      <TextField
        multiline
        onChange={(e) => { reg.notes =  e.target.value }}
        rows={4}
        sx={{ width: '100%' }}
        value={reg.notes}
      />
    </CollapsibleSection>
  );
})
