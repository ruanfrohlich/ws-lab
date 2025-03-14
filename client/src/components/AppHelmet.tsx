import { Helmet } from 'react-helmet';

interface IAppHelmetProps {
  title: string;
  description: string;
}

export const AppHelmet = (props: IAppHelmetProps) => {
  return (
    <Helmet>
      <title>WS Lab | {props.title}</title>
      <meta name='description' content={props.description} />
    </Helmet>
  );
};
