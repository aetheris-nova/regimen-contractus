import type { TSmartCharacterWithExtendedProps } from '@aetherisnova/types';

// utils
import useStore from '@client/utils/useStore';

export default function useSelectSelectedAccount(): TSmartCharacterWithExtendedProps | null {
  return useStore((state) => state.accounts.find(({ address }) => address === state.selectedAccountAddress) || null);
}
