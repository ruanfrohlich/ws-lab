import { ReactNode } from 'react';
import { Helmet } from 'react-helmet';

interface IAppHelmetProps {
  title?: string;
  description: string;
  children?: ReactNode;
}

export const AppHelmet = (props: IAppHelmetProps) => {
  return (
    <Helmet>
      <title>{props.title ? `WS Lab | ${props.title}` : 'WS Lab'}</title>
      <meta name='description' content={props.description} />
      {props.children}
    </Helmet>
  );
};
