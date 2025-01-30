import { ColorMode } from '@chakra-ui/color-mode';

// utils
import useStore from '@client/utils/useStore';

export default function useSelectColorMode(): ColorMode {
  return useStore((state) => state.colorMode);
}
