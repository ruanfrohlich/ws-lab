import { Fragment, ReactNode, useEffect, useRef, useState } from 'react';
import { AppLink, AppLoading, Header } from '../components';
import { Avatar, Box, Breadcrumbs, Button, Typography, Zoom } from '@mui/material';
import { configProvider, translatePathname } from '../utils';
import { useLocation } from 'react-router';
import { useUser } from '../contexts';
import { useServices } from '../hooks';
import { ArrowBackIosRounded, EmojiPeople, OndemandVideo, Storefront } from '@mui/icons-material';
import { capitalize } from 'lodash';

export const AppLayout = (props: { children: ReactNode }) => {
  const { appRoot } = configProvider();
  const [breadItems, setBreadItems] = useState<string[]>([]);
  const { pathname } = useLocation();
  const { user } = useUser();
  const { redirectHome, hasAuthCookie } = useServices();
  const [activityShow, setActivityShow] = useState<boolean>(true);
  const mainRef = useRef<HTMLElement>(null);
  const pageContent = useRef<HTMLElement>(null);
  const activityBox = useRef<HTMLElement>(null);

  const handleShowActivity = () => {
    const { current: content } = pageContent;
    const { current: activity } = activityBox;

    if (content && activity) {
      activity.style.right = activityShow ? '0px' : `-${activity.getBoundingClientRect().width + 4}px`;
    }

    setActivityShow(!activityShow);
  };

  useEffect(() => {
    handleShowActivity();

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
      fontSize={10}
      sx={{
        display: 'flex',
        gap: '6px',
        alignItems: 'center',
        justifyContent: 'flex-start',
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
            <Box
              ref={activityBox}
              sx={({ palette }) => ({
                transition: '300ms ease-in-out',
                borderLeft: `1px solid ${palette.primary.main}`,
                backgroundColor: palette.primary.dark,
                position: 'fixed',
                right: 0,
                height: '100vh',
                minWidth: '250px',
                zIndex: 999,
              })}
            >
              <Button
                onClick={handleShowActivity}
                color='primary'
                variant='outlined'
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: 0,
                  margin: '0',
                  padding: '0',
                  minWidth: '30px',
                  transform: 'translate(-28px, -50%)',
                  borderRight: 'none',
                  svg: {
                    transform: activityShow ? 'rotate(180deg);' : 'rotate(0);',
                    transition: '250ms ease-in-out',
                  },
                }}
              >
                <ArrowBackIosRounded />
              </Button>
              <Box
                sx={{
                  display: 'flex',
                  position: 'relative',
                  flexDirection: 'column',
                  gap: 5,
                  padding: '20px 10px',
                }}
              >
                <Box>
                  <StyledTitle>
                    <EmojiPeople />
                    Amigos
                  </StyledTitle>
                  <Box
                    component={'ul'}
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 1,
                      margin: '0',
                      padding: '0 25px',
                    }}
                  >
                    {user?.friends.map((friend) => {
                      if (friend.status !== 'accepted') return;

                      const getStatusColor = () => {
                        switch (friend.activityStatus) {
                          case 'away': {
                            return 'warning';
                          }
                          case 'busy': {
                            return 'error';
                          }
                          case 'online': {
                            return 'success';
                          }
                          default: {
                            return 'primary';
                          }
                        }
                      };

                      return (
                        <Box
                          component={'li'}
                          key={friend.id}
                          sx={{ padding: '0', display: 'flex', gap: 1, alignItems: 'center', position: 'relative' }}
                        >
                          <Avatar
                            sx={{
                              width: 30,
                              height: 30,
                              fontSize: '80%',
                              border: '1px solid currentColor',
                              color: getStatusColor(),
                            }}
                            alt={friend.user.name}
                            src={friend.user.profilePic}
                          />
                          <Typography>
                            {friend.user.name}{' '}
                            <Box
                              component={'span'}
                              sx={{
                                display: 'block',
                                fontSize: '10px',
                                color: getStatusColor(),
                              }}
                            >
                              {capitalize(friend.activityStatus)}
                            </Box>
                          </Typography>
                        </Box>
                      );
                    })}
                  </Box>
                </Box>
                <Box>
                  <StyledTitle>
                    <Storefront /> Servidores
                  </StyledTitle>
                </Box>
                <Box>
                  <StyledTitle>
                    <OndemandVideo /> Canais
                  </StyledTitle>
                </Box>
              </Box>
            </Box>
            <Box
              ref={pageContent}
              sx={{
                transition: '300ms ease-in-out',
              }}
            >
              {props.children}
            </Box>
          </Box>
        </Zoom>
      </Box>
    </Fragment>
  );
};
