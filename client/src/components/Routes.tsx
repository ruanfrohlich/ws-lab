import { Route, Routes, useLocation, useNavigate } from 'react-router';
import { App } from '../App';
import { Home, Login, Test } from '../pages';
import { useEffect } from 'react';
import { configProvider } from '../utils';

export const AppRoutes = () => {
  const { pathname } = useLocation();
  const navigator = useNavigate();
  const { appRoot } = configProvider();

  useEffect(() => {
    if (pathname === '/') {
      console.log('redirecionando');

      navigator(appRoot);
    }
  }, []);

  return (
    <Routes>
      <Route path={appRoot} element={<App />}>
        <Route index element={<Home />} />
        <Route path='login' element={<Login />}>
          <Route path='test' element={<Test />} />
        </Route>
      </Route>
    </Routes>
  );
};
