import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import { AuthPage } from './AuthPage';

export const UsersPage = observer(function UsersPage() {
  const { t } = useTranslation();

  return (
    <AuthPage title={t('users')}>
    </AuthPage>
  )
})
