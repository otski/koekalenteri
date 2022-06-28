import { CheckBox, CheckBoxOutlineBlank } from "@mui/icons-material";
import { Autocomplete, AutocompleteChangeReason, Avatar, Checkbox, Chip, TextField } from "@mui/material";
import { getDay, isSameDay } from "date-fns";
import { AdminEvent, EventClass, EventState } from "koekalenteri-shared/model";
import { runInAction } from "mobx";
import { observer } from "mobx-react-lite";
import { useTranslation } from "react-i18next";
import { CAdminEvent } from "../../../stores/classes";

/**
 * Callback fired when the value changes.
 *
 * @param {React.SyntheticEvent} event The event source of the callback.
 * @param {T|T[]} value The new value of the component.
 * @param {string} reason One of "createOption", "selectOption", "removeOption", "blur" or "clear".
 */
type EventClassesOnChange = (
  event: React.SyntheticEvent,
  value: EventClass[],
  reason: AutocompleteChangeReason
) => void;


type EventClassesProps = {
  id: string
  event: CAdminEvent
  value: EventClass[] | undefined
  classes: EventClass[]
  label: string
  required?: boolean
  requiredState?: EventState
  errorStates?: { [Property in keyof AdminEvent]?: boolean }
  helperTexts?: { [Property in keyof AdminEvent]?: string }
  onChange: EventClassesOnChange
}

export const isSameEventClass = (a: EventClass, b: EventClass) =>
  isSameDay(a.date || new Date(), b.date || new Date()) && a.class === b.class;

export const EventClasses = observer(function EventClasses(props: EventClassesProps) {
  const { t } = useTranslation();
  const { classes, label, event, required, requiredState, errorStates, helperTexts, onChange, ...rest } = props;
  const error = errorStates?.classes;
  const helperText = helperTexts?.classes || '';

  return (
    <Autocomplete
      {...rest}
      fullWidth
      disableClearable
      disableCloseOnSelect
      disabled={classes.length === 0}
      multiple
      groupBy={c => t('weekday', { date: c.date })}
      options={classes}
      getOptionLabel={c => c.class}
      isOptionEqualToValue={(o, v) => isSameEventClass(o, v)}
      onChange={(e, v, r) => {
        if (onChange) {
          runInAction(() => onChange(e, v, r))
        }
      }}
      renderOption={(optionProps, option, { selected }) => (
        <li {...optionProps}>
          <Checkbox
            icon={<CheckBoxOutlineBlank fontSize="small" />}
            checkedIcon={<CheckBox fontSize="small" />}
            style={{ marginRight: 8 }}
            checked={selected}
          />
          {option.class}
        </li>
      )}
      renderInput={(inputProps) => <TextField {...inputProps} required={required} error={!!error} helperText={helperText} label={label} />}
      renderTags={(tagValue, getTagProps) => tagValue.map((option, index) => (
        <Chip
          {...getTagProps({ index })}
          avatar={<Avatar>{t('weekday', { date: option.date })}</Avatar>}
          label={option.class}
          onDelete={undefined}
          size="small"
          sx={{
            bgcolor: option.judge?.id ? 'background.ok' : 'transparent',
            '> .MuiChip-avatar': {
              color: 'white',
              fontWeight: 'bold',
              bgcolor: 'background.weekdays.'+getDay(option.date || event.startDate)
            }
          }}
          variant={option.judge ? "filled" : "outlined"}
        />
      ))}
    />
  );
})
