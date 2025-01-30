import type { ILogger } from '@aetherisnova/types';

// utils
import useStore from '@client/utils/useStore';

export default function useSelectLogger(): ILogger {
  return useStore((state) => state.logger);
}
