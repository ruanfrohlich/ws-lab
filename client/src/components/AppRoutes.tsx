import { createBrowserRouter, RouteObject, RouterProvider } from 'react-router';
import { App } from '../App';
import { Home, LoginRegister, UserAccount, Error, User } from 'pages';
import { configProvider } from 'utils';

export const AppRoutes = () => {
  const { appRoot } = configProvider();

  const routes: RouteObject[] = [
    {
      path: appRoot,
      Component: App,
      errorElement: <Error type='appError' />,
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
          path: 'user',
          Component: UserAccount,
        },
        {
          path: 'user/:username',
          Component: User,
        },
        {
          path: '*',
          element: <Error type='notFound' />,
        },
      ],
    },
  ];

  const router = createBrowserRouter(routes);

  return <RouterProvider router={router} />;
};
