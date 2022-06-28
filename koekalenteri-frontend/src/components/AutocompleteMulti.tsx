/* eslint-disable mobx/missing-observer */
import { CheckBoxOutlineBlank, CheckBox } from "@mui/icons-material";
import { Autocomplete, AutocompleteProps, Checkbox, TextField } from "@mui/material";
import { withName } from "./hoc";

type OmitProps = 'disableCloseOnSelect' | 'fullWidth' | 'freeSolo' | 'multiple' | 'renderInput' | 'renderOption' | 'renderTags';

export type AutocompleteMultiProps<T> = Omit<AutocompleteProps<T, true, false, false>, OmitProps> & {
  error?: boolean
  helperText?: string
  label: string
}

export function AutocompleteMulti<T>(props: AutocompleteMultiProps<T>) {
  const { error, helperText, label, ...acProps } = props;
  const getLabel = props.getOptionLabel || ((o: T) => o);
  const NamedAutocomplete = withName(Autocomplete<T, true, false, false>, label);

  return (
    <NamedAutocomplete
      autoHighlight
      data-testid={label}
      {...acProps}
      disableCloseOnSelect
      fullWidth
      multiple
      renderInput={(inputProps) => <TextField {...inputProps} label={label} error={error} helperText={helperText} />}
      renderOption={(optionProps, option, { selected }) => (
        <li {...optionProps}>
          <Checkbox
            icon={<CheckBoxOutlineBlank fontSize="small" />}
            checkedIcon={<CheckBox fontSize="small" />}
            style={{ marginRight: 8 }}
            checked={selected}
          />
          <>{getLabel(option)}</>
        </li>
      )}
    />
  );
}
