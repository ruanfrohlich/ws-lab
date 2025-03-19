import { Outlet } from 'react-router';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box } from '@mui/material';
import { useWebsocketContext } from './contexts';
import { DefaultLayout } from './layouts/DefaultLayout';

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
    <ThemeProvider theme={appTheme}>
      <WebsocketContext.Provider value={websocket}>
        <CssBaseline />
        <DefaultLayout>
          <Box component='main' sx={{ position: 'relative' }}>
            <Outlet />
          </Box>
        </DefaultLayout>
      </WebsocketContext.Provider>
    </ThemeProvider>
  );
}
