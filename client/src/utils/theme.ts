import { createTheme } from '@mui/material';
import '@fontsource-variable/jetbrains-mono';
import '@fontsource/boldonse';

export const appTheme = createTheme({
  typography: {
    fontFamily: "'JetBrains Mono Variable', monospace",
    h2: {
      fontFamily: "'Boldonse', system-ui",
    },
  },
  palette: {
    mode: 'dark',
    primary: {
      main: '#e7e7e7',
      dark: '#1d1d1c',
    },
    secondary: {
      main: '#0fa4d1',
      dark: '#1d0c0c',
    },
  },
});
