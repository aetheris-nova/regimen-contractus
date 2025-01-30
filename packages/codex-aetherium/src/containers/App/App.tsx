import { AppProvider } from '@aetherisnova/ui-components';
import { type FC } from 'react';

// containers
import Router from '@client/containers/Router';

// types
import type { IProps } from './types';

const App: FC<IProps> = ({ i18n }) => {
  return (
    <AppProvider i18n={i18n}>
      <Router />
    </AppProvider>
  );
};

export default App;
