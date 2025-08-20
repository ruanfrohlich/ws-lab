import { Outlet } from 'react-router';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AppLayout } from 'layouts/AppLayout';
import { StrictMode } from 'react';
import { UserProvider, WebsocketProvider } from 'providers';
import { appTheme } from 'utils';

export function App() {
  return (
    <StrictMode>
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
    </StrictMode>
  );
}
