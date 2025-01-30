import type { TSmartCharacterWithExtendedProps } from '@aetherisnova/types';
import type { Address } from 'viem';

interface ISlice {
  // state
  accounts: TSmartCharacterWithExtendedProps[];
  fetchingAccounts: Address[];
  selectedAccountAddress: string | null;
  smartCharacterPollingInterval: number | null;
  // actions
  setAccountsAction: (addresses: Address[]) => Promise<TSmartCharacterWithExtendedProps[]>;
  startPollingForSmartCharacterAction: (payload?: undefined) => void;
  stopPollingForSmartCharacterAction: (payload?: undefined) => void;
}

export default ISlice;
