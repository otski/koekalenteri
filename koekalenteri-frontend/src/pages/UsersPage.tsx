import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { AuthPage } from './AuthPage';

export function UsersPage() {
  const { t } = useTranslation();

  return (
    <AuthPage>
      <Typography variant="h5">{t('users')}</Typography>
    </AuthPage>
  )
}

