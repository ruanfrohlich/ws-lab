import { createBrowserRouter, RouteObject, RouterProvider } from 'react-router';
import { App } from '../App';
import { Home, LoginRegister, NotFound, UserAccount } from '../pages';
import { configProvider } from '../utils';

export const AppRoutes = () => {
  const { appRoot } = configProvider();

  const routes: RouteObject[] = [
    {
      path: appRoot,
      Component: App,
      children: [
        {
          index: true,
          Component: Home,
        },
        {
          path: 'join',
          Component: LoginRegister,
        },
        {
          path: 'account',
          Component: UserAccount,
        },
        {
          path: '*',
          Component: NotFound,
        },
      ],
    },
  ];

  const router = createBrowserRouter(routes);

  return <RouterProvider router={router} />;
};
