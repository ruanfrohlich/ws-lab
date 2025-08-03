import { Fragment, ReactNode, useEffect, useRef, useState } from 'react';
import { AppLink, AppLoading, Header } from '../components';
import { Avatar, Box, Breadcrumbs, Button, Slide, Typography, Zoom } from '@mui/material';
import { configProvider, translatePathname } from '../utils';
import { useLocation } from 'react-router';
import { useUser } from '../contexts';
import { useServices } from '../hooks';
import { ArrowBackIosRounded } from '@mui/icons-material';

export const AppLayout = (props: { children: ReactNode }) => {
  const { appRoot } = configProvider();
  const [breadItems, setBreadItems] = useState<string[]>([]);
  const { pathname } = useLocation();
  const { user } = useUser();
  const { redirectHome, hasAuthCookie } = useServices();
  const [activityContainer, setActivityContainer] = useState<boolean>(false);
  const mainRef = useRef<HTMLElement>(null);
  const pageContent = useRef<HTMLElement>(null);

  const handleActivityContainer = () => {
    setActivityContainer(!activityContainer);
  };

  useEffect(() => {
    if (pathname === '/') {
      console.log('redirecionando');
      redirectHome();
    }
  }, []);

  useEffect(() => {
    setBreadItems(pathname.split('/'));
  }, [pathname]);

  const StyledTitle = (props: { children: ReactNode }) => (
    <Typography
      component={'h2'}
      fontSize={12}
      sx={{
        fontFamily: '"Boldonse", system-ui',
        marginBottom: '10px',
      }}
    >
      {props.children}
    </Typography>
  );

  return (
    <Fragment>
      <AppLoading show={hasAuthCookie && !user} />
      <Header {...{ mainRef }} />
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
        ref={mainRef}
        sx={({ palette }) => ({
          position: 'relative',
          paddingTop: '30px',
          minHeight: '100vh',
          backgroundColor: `rgba(${palette.primary.dark}, 0.8)`,
        })}
      >
        <Zoom in={!!user || !hasAuthCookie} style={{ transitionDelay: '100ms' }}>
          <Box>
            <Slide direction='left' in style={{ transitionDelay: '200ms' }}>
              <Box
                sx={({ palette }) => ({
                  borderRight: `1px solid ${palette.primary.main}`,
                  backgroundColor: palette.primary.dark,
                  position: 'fixed',
                  top: '0',
                  left: '0',
                  height: '100vh',
                  maxWidth: '250px',
                  paddingTop: '30px',
                  zIndex: 999,
                })}
              >
                <Button
                  onClick={handleActivityContainer}
                  color='primary'
                  variant='outlined'
                  sx={{
                    position: 'absolute',
                    top: '50%',
                    right: 0,
                    margin: '0',
                    padding: '0',
                    minWidth: '30px',
                    transform: 'translate(97%, -50%)',
                    borderLeft: 'none',
                  }}
                >
                  <ArrowBackIosRounded />
                </Button>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    padding: '20px',
                  }}
                >
                  <Box>
                    <StyledTitle>Amigos</StyledTitle>
                    <Box
                      component={'ul'}
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 1,
                        margin: '0',
                        padding: '0',
                      }}
                    >
                      {user?.friends.map((friend) => (
                        <Box
                          component={'li'}
                          key={friend.id}
                          sx={{ padding: '0', display: 'flex', gap: 1, alignItems: 'center' }}
                        >
                          <Avatar sx={{ width: 24, height: 24, fontSize: '80%' }}>{friend.user.name.at(0)}</Avatar>
                          {friend.user.name}
                        </Box>
                      ))}
                    </Box>
                  </Box>
                  <Box>
                    <StyledTitle>Servidores</StyledTitle>
                  </Box>
                  <Box>
                    <StyledTitle>Canais</StyledTitle>
                  </Box>
                </Box>
              </Box>
            </Slide>
            <Box ref={pageContent}>{props.children}</Box>
          </Box>
        </Zoom>
      </Box>
    </Fragment>
  );
};
