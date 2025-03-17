import { Outlet, useLocation } from 'react-router';
import { AppLink, Header } from './components';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box, Breadcrumbs, capitalize, Typography } from '@mui/material';
import { useEffect, useRef, useState } from 'react';

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
  const { pathname } = useLocation();
  const [breadItems, setBreadItems] = useState<string[]>([]);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    setBreadItems(pathname.split('/'));

    if (ref.current) {
      document.body.style.paddingTop = `${ref.current.getBoundingClientRect().height}px`;
    }
  }, [pathname]);

  return (
    <ThemeProvider theme={appTheme}>
      <CssBaseline />
      <Header />
      <Breadcrumbs
        ref={ref}
        sx={(theme) => ({
          backgroundColor: theme.palette.primary.dark,
          position: 'fixed',
          top: 0,
          left: 0,
          paddingBlock: 0.2,
          zIndex: 1000,
          width: '100%',
          borderBottom: '1px solid white',
        })}
      >
        {breadItems.map((el, i) => {
          if (breadItems.length - 1 === i) {
            return (
              <Typography key={el} sx={{ color: 'text.primary' }}>
                {el === 'app' ? 'Home' : capitalize(el)}
              </Typography>
            );
          }

          return el === 'app' ? (
            <AppLink key={el} to='/app'>
              Home
            </AppLink>
          ) : (
            <AppLink key={el} to={el}>
              {capitalize(el)}
            </AppLink>
          );
        })}
      </Breadcrumbs>
      <Box
        component='main'
        sx={{
          height: 1500,
        }}
      >
        <Outlet />
      </Box>
    </ThemeProvider>
  );
}
