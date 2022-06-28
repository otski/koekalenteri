import { Checkbox, FormControlLabel, FormGroup, FormHelperText, Grid } from "@mui/material";
import { VisibleContactInfo, ShowContactInfo, AdminEvent } from "koekalenteri-shared/model";
import { observer } from "mobx-react-lite";
import { useTranslation } from "react-i18next";
import { CollapsibleSection } from "../..";
import { CAdminEvent } from "../../../stores/classes";
import { EventContactInfo } from "../../EventContactInfo";
import { FieldRequirements } from "./validation";

type ContactInfoSectionParams = {
  event: CAdminEvent
  errorStates: { [Property in keyof AdminEvent]?: boolean }
  helperTexts: { [Property in keyof AdminEvent]?: string }
  fields: FieldRequirements
  onChange: (props: Partial<AdminEvent>) => void
  onOpenChange?: (value: boolean) => void
  open?: boolean
};

export const ContactInfoSection = observer(function ContactInfoSection({ event, errorStates, helperTexts, onChange, onOpenChange, open }: ContactInfoSectionParams) {
  const { t } = useTranslation();
  const handleChange = (props: Partial<VisibleContactInfo>) => onChange({ visibleContactInfo: { ...event.visibleContactInfo, ...props } });
  const helperText = helperTexts.contactInfo || '';
  const error = errorStates.contactInfo;
  const sectionHelper = open ? '' : error ? helperText : JSON.stringify(event.visibleContactInfo);

  return (
    <CollapsibleSection title={t('event.contactInfo')} open={open} onOpenChange={onOpenChange} error={error} helperText={sectionHelper}>
      <Grid container spacing={1}>
        <Grid item container spacing={1}>
          <Grid item>
            <PersonContactInfo contact='official' show={event.visibleContactInfo?.official} onChange={handleChange} />
          </Grid>
          <Grid item>
            <PersonContactInfo contact='secretary' show={event.visibleContactInfo?.secretary} onChange={handleChange} />
          </Grid>
        </Grid>
      </Grid>
      <FormHelperText error>{helperText}</FormHelperText>
      <hr />
      <EventContactInfo event={event} />
    </CollapsibleSection>
  );
})

const PersonContactInfo = observer(function PersonContactInfo({contact, show, onChange}: { contact: 'official'|'secretary', show?: Partial<ShowContactInfo>, onChange: (props: Partial<VisibleContactInfo>) => void }) {
  const { t } = useTranslation();
  const handleChange = (props: Partial<ShowContactInfo>) => onChange({ [contact]: {...show, ...props} });

  return (
    <>
      {t(`event.${contact}`)}
      <FormGroup row>
        <FormControlLabel
          control={<Checkbox checked={!!show?.name} onChange={e => handleChange({ name: e.target.checked })} />}
          label="Nimi"
        />
        <FormControlLabel
          control={<Checkbox checked={!!show?.email} onChange={e => handleChange({ email: e.target.checked })} />}
          label="Sähköposti"
        />
        <FormControlLabel
          control={<Checkbox checked={!!show?.phone} onChange={e => handleChange({ phone: e.target.checked })} />}
          label="Puhelin"
        />
      </FormGroup>
    </>
  );
})
