import { Route, Routes } from 'react-router';
import { App } from '../App';
import { Home, Login, Test } from '../pages';

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path='/app' element={<App />}>
        <Route index element={<Home />} />
        <Route path='login' element={<Login />} />
        <Route path='test/:token' element={<Test />} />
      </Route>
    </Routes>
  );
};
