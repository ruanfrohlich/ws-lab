import { Helmet } from 'react-helmet';

interface IAppHelmetProps {
  title?: string;
  description: string;
}

export const AppHelmet = (props: IAppHelmetProps) => {
  return (
    <Helmet>
      <title>{props.title ? `WS Lab | ${props.title}` : 'WS Lab'}</title>
      <meta name='description' content={props.description} />
    </Helmet>
  );
};
