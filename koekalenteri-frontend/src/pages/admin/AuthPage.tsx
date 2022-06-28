import { useAuthenticator } from '@aws-amplify/ui-react';
import { Box, CircularProgress, Toolbar } from '@mui/material';
import { observer } from 'mobx-react-lite';
import { ReactNode, useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Header, SideMenu } from '../../layout';
import { useSessionStarted, useStores } from '../../stores';

export const AuthPage = observer(function AuthPage({ children, title }: { children: ReactNode, title?: string }) {
  const location = useLocation();
  const { route } = useAuthenticator(context => [context.route]);
  const { rootStore } = useStores();
  const [menuOpen, setMenuOpen] = useState(false);
  const [sessionStarted, setSessionStarted] = useSessionStarted();

  useEffect(() => {
    if (!sessionStarted) {
      setSessionStarted(new Date().toISOString());
    }
    if (!rootStore.loaded) {
      rootStore.load();
    }
  });

  return (route !== 'authenticated' ? <Navigate to="/login" state={{ from: location }} replace /> :
    <>
      <Header title={title} toggleMenu={() => setMenuOpen(!menuOpen)} />
      <Box sx={{ display: 'flex', height: '100%' }}>
        <SideMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
        <Box sx={{ p: 1, display: 'flex', flexDirection: 'column', flexGrow: 1, overflow: 'auto' }}>
          <Toolbar variant="dense" />
          {rootStore.loading ? <CircularProgress /> : children}
        </Box>
      </Box>
    </>
  );
})
