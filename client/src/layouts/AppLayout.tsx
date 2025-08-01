import { Fragment, ReactNode, useEffect, useState } from 'react';
import { AppLink, AppLoading, Header } from '../components';
import { Box, Breadcrumbs, Typography, Zoom } from '@mui/material';
import { configProvider, translatePathname } from '../utils';
import { useLocation } from 'react-router';
import { useUser } from '../contexts';
import { useServices } from '../hooks';

export const AppLayout = (props: { children: ReactNode }) => {
  const { appRoot } = configProvider();
  const [breadItems, setBreadItems] = useState<string[]>([]);
  const { pathname } = useLocation();
  const { user } = useUser();
  const { redirectHome, hasAuthCookie } = useServices();

  useEffect(() => {
    if (pathname === '/') {
      console.log('redirecionando');
      redirectHome();
    }
  }, []);

  useEffect(() => {
    setBreadItems(pathname.split('/'));
  }, [pathname]);

  return (
    <Fragment>
      <AppLoading show={hasAuthCookie && !user} />
      <Header />
      <Breadcrumbs
        sx={({ palette }) => ({
          backgroundColor: palette.primary.dark,
          display: 'flex',
          alignItems: 'center',
          position: 'fixed',
          top: 0,
          left: 0,
          paddingBlock: 0.2,
          zIndex: 1000,
          width: '100%',
          borderBottom: '1px solid white',
          height: '30px',
          boxShadow: '0 4px 12px rgba(0,0,0,.3)',
        })}
      >
        {breadItems.map((el, i) => {
          if (breadItems.length - 1 === i) {
            return (
              <Typography key={el} sx={{ color: 'text.primary' }}>
                {el === appRoot.replace('/', '') ? 'Início' : translatePathname(el)}
              </Typography>
            );
          }

          return el === appRoot.replace('/', '') ? (
            <AppLink key={el} to={appRoot}>
              Inicio
            </AppLink>
          ) : (
            <AppLink key={el} to={el}>
              {translatePathname(el)}
            </AppLink>
          );
        })}
      </Breadcrumbs>
      <Box
        component='main'
        sx={({ palette }) => ({
          position: 'relative',
          paddingTop: '30px',
          minHeight: '100vh',
          backgroundColor: `rgba(${palette.primary.dark}, 0.8)`,
        })}
      >
        <Zoom in={!!user || !hasAuthCookie} style={{ transitionDelay: '100ms' }}>
          <Box>{props.children}</Box>
        </Zoom>
      </Box>
    </Fragment>
  );
};
