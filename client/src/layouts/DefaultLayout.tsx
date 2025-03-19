import { Fragment, ReactNode, useEffect, useRef, useState } from 'react';
import { useWebsocketContext } from '../contexts';
import { AppLink, Header } from '../components';
import { Breadcrumbs, capitalize, Typography } from '@mui/material';
import { configProvider } from '../utils';
import { useLocation, useNavigate } from 'react-router';

export const DefaultLayout = (props: { children: ReactNode }) => {
  const { websocket } = useWebsocketContext();
  const { appRoot } = configProvider();
  const [breadItems, setBreadItems] = useState<string[]>([]);
  const ref = useRef<HTMLElement>(null);
  const { pathname } = useLocation();
  const navigator = useNavigate();

  useEffect(() => {
    if (pathname === '/') {
      console.log('redirecionando');

      navigator(appRoot);
    }
  }, []);

  useEffect(() => {
    setBreadItems(pathname.split('/'));

    if (ref.current) {
      document.body.style.paddingTop = `${ref.current.getBoundingClientRect().height}px`;
    }

    console.log('#### Websocket State ####');

    console.log(websocket);
  }, [pathname]);

  return (
    <Fragment>
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
                {el === appRoot.replace('/', '') ? 'Home' : capitalize(el)}
              </Typography>
            );
          }

          return el === appRoot.replace('/', '') ? (
            <AppLink key={el} to={appRoot}>
              Home
            </AppLink>
          ) : (
            <AppLink key={el} to={el}>
              {capitalize(el)}
            </AppLink>
          );
        })}
      </Breadcrumbs>
      {props.children}
    </Fragment>
  );
};
