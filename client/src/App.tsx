import { Outlet } from 'react-router';
import CssBaseline from '@mui/material/CssBaseline';
import { AppLayout } from 'layouts/AppLayout';
import { UserProvider, WebsocketProvider } from 'providers';
import { ThemeProvider } from '@mui/material';
import { appTheme } from 'utils';

export function App() {
  return (
    <ThemeProvider theme={appTheme}>
      <UserProvider>
        <WebsocketProvider>
          <CssBaseline />
          <AppLayout>
            <Outlet />
          </AppLayout>
        </WebsocketProvider>
      </UserProvider>
    </ThemeProvider>
  );
}
