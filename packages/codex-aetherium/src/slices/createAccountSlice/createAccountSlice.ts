// actions
import setAccountsAction from './actions/setAccountsAction';
import startPollingForSmartCharacterAction from './actions/startPollingForSmartCharacterAction';
import stopPollingForSmartCharacterAction from './actions/stopPollingForSmartCharacterAction';

// types
import type { TStateCreator } from '@client/types';
import type { ISlice } from './types';

const createAccountSlice: TStateCreator<ISlice> = (setState, getState) => {
  const api = { getState, setState };

  return {
    smartCharacterPollingInterval: null,
    accounts: [],
    fetchingAccounts: [],
    selectedAccountAddress: null,
    // setters
    setAccountsAction: setAccountsAction(api),
    startPollingForSmartCharacterAction: startPollingForSmartCharacterAction(api),
    stopPollingForSmartCharacterAction: stopPollingForSmartCharacterAction(api),
  };
};

export default createAccountSlice;
