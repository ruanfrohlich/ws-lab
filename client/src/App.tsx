import { Outlet } from 'react-router';
import CssBaseline from '@mui/material/CssBaseline';
import { AppLayout } from 'layouts/AppLayout';
import { UserProvider, WebsocketProvider } from 'providers';
import { ThemeProvider } from '@mui/material';
import { appTheme } from 'utils';

/**
 * Componente raiz da aplicação
 * Configura providers globais, tema e layout principal
 * @returns Estrutura JSX da aplicação com todos os providers necessários
 */
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
