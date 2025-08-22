import { Fragment, ReactNode, useEffect, useRef, useState } from 'react';
import { AppLink, AppLoading, Header } from 'components';
import { Avatar, Box, Breadcrumbs, Button, Typography } from '@mui/material';
import { appStyled, configProvider, COOKIES, translatePathname } from 'utils';
import { useLocation } from 'react-router';
import { useUser } from 'contexts';
import { useServices } from 'hooks';
import {
  ArrowBackIosRounded,
  EmojiPeople,
  OndemandVideo,
  Storefront,
} from '@mui/icons-material';
import { capitalize, toLower, uniqueId } from 'lodash';
import Cookies from 'js-cookie';

export const AppLayout = (props: { children: ReactNode }) => {
  const { appRoot, assetsUrl } = configProvider();
  const [breadItems, setBreadItems] = useState<string[]>([]);
  const { pathname } = useLocation();
  const { user, logged } = useUser();
  const {
    redirectHome,
    hasAuthCookie,
    fetchUser,
    googleSignIn,
    logout,
    registerUser,
  } = useServices();
  const [activityShow, setActivityShow] = useState<boolean>(false);
  const activityBox = useRef<HTMLElement>(null);
  const pageContent = useRef<HTMLElement>(null);

  const checkUser = () => {
    const userToken = Cookies.get(COOKIES.userToken);

    (async () => {
      if (!userToken) {
        const googleUser = await googleSignIn();

        if (!googleUser) return;

        const userFormatted = {
          email: googleUser.email,
          name: googleUser.name,
          password: uniqueId(googleUser.family_name),
          username: toLower(
            `${googleUser.given_name}-${googleUser.sub.slice(0, 6)}`,
          ),
        };

        await registerUser(userFormatted, {
          image: googleUser.picture,
        });
      } else {
        const { success } = await fetchUser(userToken);

        if (!success) return logout();
      }
    })();
  };

  const handleActivityBar = () => {
    const { current: activity } = activityBox;
    const { current: content } = pageContent;

    if (activity && content) {
      appStyled(activity, {
        opacity: 1,
        right: activityShow
          ? '0px'
          : `-${activity.getBoundingClientRect().width - 10}px`,
      });
      appStyled(content, {
        marginLeft: activityShow
          ? `-${activity.getBoundingClientRect().width - 10}px`
          : '0',
      });
    }

    setActivityShow(!activityShow);
  };

  useEffect(() => {
    setBreadItems(pathname.split('/'));
    if (pathname === '/') {
      console.log('redirecionando');
      redirectHome();
    }
  }, [pathname]);

  useEffect(() => {
    if (logged) handleActivityBar();
  }, [logged]);

  useEffect(checkUser, []);

  const StyledTitle = (props: { children: ReactNode }) => (
    <Typography
      component={'h2'}
      fontSize={10}
      sx={{
        display: 'flex',
        gap: '6px',
        alignItems: 'center',
        justifyContent: 'flex-start',
        marginBottom: '10px',
      }}
      variant='h2'
    >
      {props.children}
    </Typography>
  );

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
        <Box>
          {logged && (
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
                boxShadow: '-5px 0px 10px rgba(0,0,0,.4);',
                opacity: 0,
              })}
            >
              <Button
                onClick={handleActivityBar}
                color='primary'
                variant='outlined'
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: 0,
                  margin: '0',
                  padding: '0',
                  minWidth: '30px',
                  minHeight: '50px',
                  transform: 'translate(-30px, -50%)',
                  borderRight: 'none',
                  borderRadius: '4px 0 0 4px',
                  justifyContent: 'flex-start',
                  svg: {
                    transform: activityShow ? 'rotate(0);' : 'rotate(180deg);',
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
                          sx={{
                            padding: '0',
                            display: 'flex',
                            gap: 1,
                            alignItems: 'center',
                            position: 'relative',
                          }}
                        >
                          <Avatar
                            sx={{
                              width: 30,
                              height: 30,
                              fontSize: '80%',
                              border: '1px solid currentColor',
                            }}
                            alt={friend.user.name}
                            src={assetsUrl.concat(
                              'user/',
                              friend.user.uuid,
                              '/profile-pic.webp',
                            )}
                          />
                          <Typography>
                            {friend.user.name}{' '}
                            <Box
                              component={'span'}
                              sx={{
                                display: 'block',
                                fontSize: '10px',
                                color: ({ palette }) =>
                                  `${palette[getStatusColor()].main}`,
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
          )}
          <Box ref={pageContent} sx={{ transition: '300ms ease-in-out' }}>
            {props.children}
          </Box>
        </Box>
      </Box>
    </Fragment>
  );
};
