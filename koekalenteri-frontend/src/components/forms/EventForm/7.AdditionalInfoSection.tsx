import { TextField } from '@mui/material';
import { AdminEvent } from 'koekalenteri-shared/model';
import { observer } from 'mobx-react-lite';
import { CollapsibleSection } from '../..';
import { CAdminEvent } from '../../../stores/classes';

type AdditionalInfoSectionProps = {
  event: CAdminEvent
  onChange: (props: Partial<AdminEvent>) => void
  onOpenChange?: (value: boolean) => void
  open?: boolean
}
export const AdditionalInfoSection = observer(function AdditionalInfoSection({ event, onChange, onOpenChange, open }: AdditionalInfoSectionProps) {
  return (
    <CollapsibleSection title="Lisätiedot" open={open} onOpenChange={onOpenChange}>
      <TextField rows={5} fullWidth multiline value={event.description} onChange={(e) => onChange({ description: e.target.value })}></TextField>
    </CollapsibleSection>
  );
})
