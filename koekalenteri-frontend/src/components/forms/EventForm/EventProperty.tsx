import { HelpOutlined } from '@mui/icons-material';
import { Autocomplete, AutocompleteProps, IconButton, TextField } from '@mui/material';
import { Box } from '@mui/system';
import { AdminEvent } from 'koekalenteri-shared/model';
import { Observer, observer } from 'mobx-react-lite';
import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { CAdminEvent } from '../../../stores/classes';
import { FieldRequirements, validateEventField } from './validation';
import { computed, runInAction, toJS } from 'mobx';
import { withName } from '../../hoc';

export type EventPropertyProps<Property extends keyof AdminEvent, freeSolo extends boolean> =
  Omit<AutocompleteProps<AdminEvent[Property], false, false, freeSolo>, 'renderInput' | 'onChange' | 'value'> & {
    id: Property,
    event: CAdminEvent,
    fields: FieldRequirements,
    onChange: (props: Partial<AdminEvent>) => void,
    helpClick?: React.MouseEventHandler<HTMLButtonElement>
    endAdornment?: ReactNode
  };

export const EventProperty = observer(function EventProperty<Property extends keyof AdminEvent, freeSolo extends boolean>(props: EventPropertyProps<Property, freeSolo>) {
  const { t } = useTranslation();
  const { id, event, fields: { required }, helpClick, endAdornment, ...acProps } = props;
  const isRequired = required[id] || false;
  const error = isRequired && computed(() => validateEventField(event, id, true)).get();
  const propValue = toJS(computed(() => id && event[id]).get());
  const helperText = error ? t(`validation.event.${error.key}`, error.opts) : '';
  const NamedAutocomplete = withName(Autocomplete<AdminEvent[Property], false, false, freeSolo>, id);

  return (
    <NamedAutocomplete
      id={id}
      {...acProps}
      value={propValue}
      renderInput={(params) =>
        <Observer>{() => (
          <Box sx={{ display: 'flex', flex: '0 0 auto', position: 'relative' }}>
            <TextField
              {...params}
              label={t(`event.${id}`)}
              required={isRequired}
              error={!!error}
              helperText={helperText}
              InputProps={{
                ...params.InputProps,
                endAdornment: <>{endAdornment}{params.InputProps.endAdornment}</>
              }}
            />
            <IconButton onClick={helpClick} sx={{ display: helpClick ? 'flex' : 'none', margin: 'auto' }}>
              <HelpOutlined />
            </IconButton>
          </Box>
        )}</Observer>
      }
      onChange={(e, value) => runInAction(() => props.onChange({ [id]: value || undefined }))}
      onInputChange={(e, value) => {
        if (!props.freeSolo) {
          return;
        }
        const type = typeof propValue;
        if ((type === 'number' && propValue !== +(value || '')) || (type !== 'number' && propValue !== value)) {
          props.onChange({ [id]: value });
        }
      }}
    />
  );
})
