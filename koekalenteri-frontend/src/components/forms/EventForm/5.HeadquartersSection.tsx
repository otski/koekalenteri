import { Grid, TextField } from "@mui/material";
import { AdminEvent, Headquarters } from "koekalenteri-shared/model";
import { observer } from "mobx-react-lite";
import { useTranslation } from "react-i18next";
import { CollapsibleSection } from "../..";
import { CAdminEvent } from "../../../stores/classes";

type HeadquartersSectionProps = {
  event: CAdminEvent
  onChange: (props: Partial<AdminEvent>) => void;
  onOpenChange?: (value: boolean) => void
  open?: boolean
}

export const HeadquartersSection = observer(function HeadquartersSection({ event, onChange, onOpenChange, open }: HeadquartersSectionProps) {
  const { t } = useTranslation();
  const handleChange = (props: Partial<Headquarters>) => onChange({ headquerters: { ...(event.headquerters || {}), ...props } });

  return (
    <CollapsibleSection title={t('headquarters')} open={open} onOpenChange={onOpenChange}>
      <Grid container spacing={1}>
        <Grid item container spacing={1}>
          <Grid item sx={{width: 300}}>
            <TextField label="Nimi" value={event.headquerters?.name || ''} onChange={e => handleChange({ name: e.target.value })} fullWidth />
          </Grid>
          <Grid item sx={{width: 300}}>
            <TextField label="Katuosoite" value={event.headquerters?.address || ''} onChange={e => handleChange({ address: e.target.value })} fullWidth />
          </Grid>
        </Grid>
        <Grid item container spacing={1}>
          <Grid item sx={{width: 300}}>
            <TextField label="Postinumero" value={event.headquerters?.zipCode || ''} onChange={e => handleChange({ zipCode: +e.target.value })} fullWidth />
          </Grid>
          <Grid item sx={{width: 300}}>
            <TextField label="Postitoimipaikka" value={event.headquerters?.postalDistrict || ''} onChange={e => handleChange({ postalDistrict: e.target.value })} fullWidth />
          </Grid>
        </Grid>
      </Grid>
    </CollapsibleSection>
  );
})
