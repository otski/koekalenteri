import { Box } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import { AdminEvent, EventClass, EventState } from 'koekalenteri-shared/model';
import { computed, toJS } from 'mobx';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { ADMIN_EDIT_EVENT } from '../config';
import { useSessionStorage, useStores } from '../stores';
import { CAdminEvent } from '../stores/classes/CAdminEvent';
import { StyledDataGrid } from './StyledDataGrid';

interface EventGridColDef extends GridColDef {
  field: keyof AdminEvent | 'date'
}

type StartEndDate = { start: Date, end: Date };

export const EventGrid = observer(function EventGrid() {
  const { t } = useTranslation();
  const { rootStore } = useStores();
  const [selectedId, setSelectedId] = useSessionStorage('adminEventId', '');
  const naviage = useNavigate();
  const loading = computed(() => rootStore.adminEventStore.loading).get();

  const columns: EventGridColDef[] = [
    {
      align: 'right',
      field: 'date',
      headerName: t('date'),
      width: 120,
      sortComparator: (a, b) => (b as StartEndDate).start.valueOf() - (a as StartEndDate).start.valueOf(),
      valueGetter: (params) => ({ start: params.row.startDate, end: params.row.endDate }),
      valueFormatter: ({value}) => t('daterange', value as StartEndDate),
    },
    {
      field: 'eventType',
      headerName: t('event.eventType'),
      minWidth: 100,
    },
    {
      field: 'classes',
      headerName: t('event.classes'),
      minWidth: 100,
      flex: 1,
      valueGetter: (params) => ((params.row.classes || []) as Array<EventClass|string>).map(c => typeof c === 'string' ? c : c.class).join(', ')
    },
    {
      field: 'location',
      headerName: t('event.location'),
      minWidth: 100,
      flex: 1,
    },
    {
      field: 'official',
      headerName: t('event.official'),
      minWidth: 100,
      flex: 1,
      valueGetter: (params) => params.row.official?.name
    },
    {
      field: 'judges',
      headerName: t('judgeChief'),
      minWidth: 100,
      flex: 1,
      valueGetter: (params) => params.row.judges[0]?.name
    },
    {
      field: 'places',
      headerName: t('places'),
      align: 'right',
      width: 80,
      valueGetter: (params) => params.row.places ? `${params.row.entries || 0} / ${params.row.places}` : '-'
    },
    {
      field: 'state',
      headerName: t('event.state'),
      flex: 1,
      type: 'string',
      valueGetter: (params) => (params.row as CAdminEvent).isEntryOpen ? t('event.states.confirmed_entryOpen') : t(`event.states.${(params.value || 'draft') as EventState}`)
    },
  ];

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      flexGrow: 1,
      width: '100%',
      minHeight: 300,
    }}>
      <StyledDataGrid
        autoPageSize
        columns={columns}
        density='compact'
        disableColumnMenu
        loading={loading}
        rows={toJS(rootStore.adminEventStore.events)}
        onSelectionModelChange={newSelectionModel => {
          if (loading || !newSelectionModel?.length) {
            return;
          }

          setSelectedId(newSelectionModel[0] as string);
        }}
        selectionModel={selectedId || undefined}
        onRowDoubleClick={() => naviage(`${ADMIN_EDIT_EVENT}/${selectedId}`)}
      />
    </Box>
  );
})
