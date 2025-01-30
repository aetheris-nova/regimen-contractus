import { AppProvider } from '@aetherisnova/ui-components';
import { type FC } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

// containers
import Root from '@client/containers/Root';

// pages
import WelcomePage from '@client/pages/WelcomePage';

// types
import type { IProps } from './types';

const App: FC<IProps> = ({ i18n }) => {
  // misc
  const router = createBrowserRouter([
    {
      children: [
        {
          element: <WelcomePage />,
          path: '/',
        },
      ],
      element: <Root />,
      path: '/',
    },
  ]);

  return (
    <AppProvider i18n={i18n}>
      <RouterProvider router={router} />
    </AppProvider>
  );
};

export default App;
