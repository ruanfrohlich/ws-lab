import { createTheme } from '@mui/material';
import '@fontsource/jetbrains-mono';
import '@fontsource/roboto';

export const appTheme = createTheme({
  typography: {
    fontFamily: "'JetBrains Mono Variable', monospace",
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
