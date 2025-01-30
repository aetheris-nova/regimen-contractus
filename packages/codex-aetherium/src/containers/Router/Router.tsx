import { type FC } from 'react';
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import { useAccount } from 'wagmi';

// constants
import { DASHBOARD_ROUTE, LOGIN_ROUTE } from '@client/constants';

// containers
import Root from '@client/containers/Root';

// loaders
import { authLoader, loginLoader } from '@client/loaders';

// pages
import DashboardPage from '@client/pages/DashboardPage';
import LoginPage from '@client/pages/LoginPage';

const Router: FC = () => {
  const wagmiAccount = useAccount();
  // misc
  const router = createBrowserRouter([
    {
      children: [
        {
          element: <Navigate replace={true} to={DASHBOARD_ROUTE} />,
          path: '/',
        },
        {
          element: <LoginPage />,
          loader: loginLoader(wagmiAccount),
          path: LOGIN_ROUTE,
        },
        {
          element: <DashboardPage />,
          loader: authLoader(wagmiAccount),
          path: DASHBOARD_ROUTE,
        },
      ],
      element: <Root />,
      path: '/',
    },
  ]);

  return (
    <RouterProvider router={router} />
  );
};

export default Router;

