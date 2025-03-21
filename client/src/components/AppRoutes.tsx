import { createBrowserRouter, RouterProvider } from 'react-router';
import { App } from '../App';
import { Home, LoginRegister, NotFound } from '../pages';
import { configProvider } from '../utils';

export const AppRoutes = () => {
  const { appRoot } = configProvider();
  const routes = [
    {
      path: appRoot,
      element: <App />,
      children: [
        {
          index: true,
          element: <Home />,
        },
        {
          path: 'join',
          element: <LoginRegister />,
        },
        {
          path: '*',
          element: <NotFound />,
        },
      ],
    },
  ];

  const router = createBrowserRouter(routes);

  return <RouterProvider router={router} />;
};
