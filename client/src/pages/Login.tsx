import { Fragment } from 'react';
import { AppHelmet, AppLink } from '../components';

export const Login = () => {
  return (
    <Fragment>
      <AppHelmet title='Login' description='' />
      <div className='p-3'>Login</div>
      <AppLink to={'test'}>Test</AppLink>
    </Fragment>
  );
};
