import { CloudSync } from '@mui/icons-material';
import { Box, Button, Stack } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import { Judge } from 'koekalenteri-shared/model';
import { toJS } from 'mobx';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import { StyledDataGrid } from '../components';
import { useStores } from '../stores';
import { AuthPage } from './AuthPage';

interface JudgeColDef extends GridColDef {
  field: keyof Judge
}

export const JudgeListPage = observer(function JudgeListPage() {
  const { t } = useTranslation();
  const { rootStore } = useStores();
  const columns: JudgeColDef[] = [
    {
      field: 'name',
      flex: 1,
      headerName: t('name'),
    },
    {
      field: 'id',
      headerName: t('id')
    },
    {
      field: 'location',
      flex: 1,
      headerName: t('registration.contact.city'),
    },
    {
      field: 'phone',
      flex: 1,
      headerName: t('registration.contact.phone'),
    },
    {
      field: 'email',
      flex: 2,
      headerName: t('registration.contact.email'),
    },
    {
      field: 'district',
      flex: 1,
      headerName: 'Kennelpiiri'
    },
    {
      field: 'eventTypes',
      flex: 2,
      headerName: t('eventTypes'),
      valueGetter: (params) => params.row.eventTypes?.join(', ')
    }
  ];

  const refresh = async () => {
    rootStore.judgeStore.load(true);
  };

  return (
    <AuthPage title={t('judges')}>
      <Box sx={{ display: 'flex', p: 1, overflow: 'hidden', height: '100%', flexDirection: 'column', alignItems: 'flex-start' }}>
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          flexGrow: 1,
          width: '100%',
          minHeight: 600,
        }}>
          <Stack direction="row" spacing={2}>
            <Button startIcon={<CloudSync />} onClick={refresh}>{t('updateData', { data: 'judges' })}</Button>
          </Stack>

          <StyledDataGrid
            loading={rootStore.judgeStore.loading}
            autoPageSize
            columns={columns}
            density='compact'
            disableColumnMenu
            disableVirtualization
            rows={toJS(rootStore.judgeStore.judges)}
          />
        </Box>
      </Box>
    </AuthPage>
  )
});
