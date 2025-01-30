// types
import type { TActionCreator } from '@client/types';

const stopPollingForSmartCharacterAction: TActionCreator<undefined, void> =
  ({ getState, setState }) =>
  () => {
    const interval = getState().smartCharacterPollingInterval;

    interval && window.clearInterval(interval);

    setState((state) => ({
      ...state,
      smartCharacterPollingInterval: null,
    }));
  };

export default stopPollingForSmartCharacterAction;
