import { Outlet } from 'react-router';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AppLayout } from './layouts/AppLayout';
import { StrictMode } from 'react';
import { UserProvider, WebsocketProvider } from './providers';
import { appTheme } from './utils/theme';
import { config } from 'dotenv';
import { relative } from 'path';

config({
  path: relative(
    __dirname,
    `../.env.${process.env.NODE_ENV !== 'production' ? 'dev' : 'prd'}`,
  ),
});

console.log(process.env);

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
