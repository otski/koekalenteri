import { AddOutlined, DeleteOutline } from '@mui/icons-material';
import { Button, FormHelperText, Grid } from '@mui/material';
import { isSameDay } from 'date-fns';
import { AdminEvent, EventClass, Judge } from 'koekalenteri-shared/model';
import { computed } from 'mobx';
import { Observer, observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import { CollapsibleSection } from '../..';
import { useStores } from '../../../stores';
import { CAdminEvent } from '../../../stores/classes';
import { AutocompleteSingle } from '../../AutocompleteSingle';
import { EventClasses } from './EventClasses';
import { FieldRequirements, validateEventField } from './validation';

type JudgesSectionProps = {
  event: CAdminEvent
  fields?: FieldRequirements
  onChange: (props: Partial<AdminEvent>) => void
  onOpenChange?: (value: boolean) => void
  open?: boolean
}

export const JudgesSection = observer(function JudgesSection({ event, fields, onChange, onOpenChange, open }: JudgesSectionProps) {
  const { t } = useTranslation();
  const { rootStore } = useStores();
  const error = fields?.required.judges && computed(() => validateEventField(event, 'judges', true)).get();
  const helperText = error ? t(`validation.event.${error.key}`, { ...error.opts, state: fields.state.judges || 'draft' }) : '';

  const updateJudge = (id: number | undefined, values: EventClass[]) => {
    const judge = rootStore.judgeStore.getJudge(id);
    const isSelected = (c: EventClass) => values.find(v => isSameDay(v.date || event.startDate, c.date || event.startDate) && v.class === c.class);
    const wasSelected = (c: EventClass) => c.judge?.id === id;
    const previousOrUndefined = (c: EventClass) => wasSelected(c) ? undefined : c.judge;
    return event.classes.map(c => ({
      ...c,
      judge: isSelected(c) ? judge : previousOrUndefined(c)
    }));
  }

  return (
    <CollapsibleSection title={t('judges')} open={open} onOpenChange={onOpenChange}>
      <Grid item container spacing={1}>
        {event.judges.map(j => j.toJSON()).map((judge, index) => {
          const title = index === 0 ? t('judgeChief') : t('judge') + ` ${index + 1}`;
          return (
            <Observer key={judge.id}>{() => (
              <Grid item container spacing={1} alignItems="center">
                <Grid item sx={{ width: 300 }}>
                  <AutocompleteSingle
                    value={judge}
                    label={title}
                    getOptionLabel={o => o?.name || ''}
                    isOptionEqualToValue={(o, v) => o.id === v.id}
                    options={rootStore.judgeStore.activeJudges.filter(j => !event.judges.some(ej => ej.id === j.id)).map(j => j.toJSON())}
                    onChange={(_e, value) => {
                      event.setJudge(index, value?.id);
                      onChange({});
                    }}
                  />
                </Grid>
                <Grid item sx={{ width: 300 }}>
                  <EventClasses
                    id={`class${index}`}
                    event={event}
                    value={event.classes
                      .filter(c => c.judge && c.judge.id === judge.id)
                      .map(c => ({ class: c.class, date: c.date }))
                    }
                    classes={event.classes.map(c => ({ class: c.class, date: c.date }))}
                    label="Arvostelee koeluokat"
                    onChange={(_e, values) => onChange({
                      classes: updateJudge(judge.id, values)
                    })}
                  />
                </Grid>
                <Grid item>
                  <Button startIcon={<DeleteOutline />} onClick={() => event.setJudge(index)}>Poista tuomari</Button>
                </Grid>
              </Grid>
            )}</Observer>
          );
        })}
        <Grid item><Button startIcon={<AddOutlined />} onClick={() => {
          const nextJudge = rootStore.judgeStore.activeJudges.filter(j => !event.judges.some(ej => ej.id === j.id))[0];
          if (nextJudge) {
            event.judges.push(nextJudge);
          }
        }}>Lisää tuomari</Button></Grid>
      </Grid>
      <FormHelperText error>{helperText}</FormHelperText>
    </CollapsibleSection>
  );
})
