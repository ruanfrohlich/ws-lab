import { ReactNode } from 'react';
import { Helmet } from 'react-helmet';
import { useLocation } from 'react-router';

interface IAppHelmetProps {
  title?: string;
  description: string;
  children?: ReactNode;
}

export const AppHelmet = (props: IAppHelmetProps) => {
  const { pathname } = useLocation();

  return (
    <Helmet>
      <title>{props.title ? `WS Lab | ${props.title}` : 'WS Lab'}</title>
      <meta name='description' content={props.description} />
      <link rel='canonical' href={`${process.env.SITE_URL}${pathname}`} />
      <meta property='robots' content='index, follow' />
      <meta name='keywords' content={'streaming,chat,videocall,websocket,webrtc'} />
      {props.children}
    </Helmet>
  );
};
