import { Outlet } from 'react-router';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AppLayout } from './layouts/AppLayout';
import { StrictMode } from 'react';
import 'dotenv/config';
import { UserProvider } from './providers';

const appTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#e7e7e7',
      dark: '#1d1d1c',
    },
  },
});

export function App() {
  return (
    <StrictMode>
      <ThemeProvider theme={appTheme}>
        <UserProvider>
          <CssBaseline />
          <AppLayout>
            <Outlet />
          </AppLayout>
        </UserProvider>
      </ThemeProvider>
    </StrictMode>
  );
}
