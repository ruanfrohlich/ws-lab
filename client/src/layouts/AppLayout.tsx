import { Fragment, ReactNode, useEffect, useRef, useState } from 'react';
import { AppLink, AppLoading, Header } from 'components';
import { Box, Breadcrumbs, Typography } from '@mui/material';
import { configProvider, COOKIES, translatePathname } from 'utils';
import { useLocation } from 'react-router';
import { useUser } from 'contexts';
import { useServices } from 'hooks';
import Cookies from 'js-cookie';

export const AppLayout = (props: { children: ReactNode }) => {
  const { appRoot } = configProvider();
  const [breadItems, setBreadItems] = useState<string[]>([]);
  const { pathname } = useLocation();
  const { user } = useUser();
  const { redirectHome, hasAuthCookie, fetchUser, logout, googleSignIn } =
    useServices();
  const pageContent = useRef<HTMLElement>(null);

  const checkUser = () => {
    const userToken = Cookies.get(COOKIES.userToken);

    (async () => {
      if (!userToken) {
        await googleSignIn();
      } else {
        const { success } = await fetchUser(userToken);

        if (!success) return logout();
      }
    })();
  };

  useEffect(() => {
    setBreadItems(pathname.split('/'));
    if (pathname === '/') {
      console.log('redirecionando');
      redirectHome();
    }
  }, [pathname]);

  useEffect(checkUser, []);

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
                {el === appRoot.replace('/', '')
                  ? 'Início'
                  : translatePathname(el)}
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
        <Box ref={pageContent} sx={{ transition: '300ms ease-in-out' }}>
          {props.children}
        </Box>
      </Box>
    </Fragment>
  );
};
