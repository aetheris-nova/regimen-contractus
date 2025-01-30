import type { IWorldConfigWithExtendedProps } from '@aetherisnova/types';

// utils
import useStore from '@client/utils/useStore';

export default function useSelectWorldConfig(): IWorldConfigWithExtendedProps | null {
  return useStore(({ worldConfig }) => worldConfig);
}
