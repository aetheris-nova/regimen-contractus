import type { INativeCurrency } from '@aetherisnova/types';

// utils
import useStore from '@client/utils/useStore';

export default function useSelectNativeCurrency(): INativeCurrency | null {
  return useStore(({ worldConfig }) => worldConfig?.nativeCurrency || null);
}
