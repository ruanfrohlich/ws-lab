import { createBrowserRouter, RouterProvider } from 'react-router';
import { App } from '../App';
import { Home, Login, NotFound, Test } from '../pages';
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
          path: 'login',
          element: <Login />,
          children: [
            {
              path: 'test',
              element: <Test />,
            },
          ],
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
