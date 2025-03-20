import { Outlet } from 'react-router';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useWebsocketContext } from './contexts';
import { AppLayout } from './layouts/AppLayout';
import { StrictMode } from 'react';

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
  const { WebsocketContext, websocket } = useWebsocketContext();

  return (
    <StrictMode>
      <ThemeProvider theme={appTheme}>
        <WebsocketContext.Provider value={websocket}>
          <CssBaseline />
          <AppLayout>
            <Outlet />
          </AppLayout>
        </WebsocketContext.Provider>
      </ThemeProvider>
    </StrictMode>
  );
}
