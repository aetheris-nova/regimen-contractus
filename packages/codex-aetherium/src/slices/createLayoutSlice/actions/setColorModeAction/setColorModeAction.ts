import { ColorMode } from '@chakra-ui/color-mode';

// types
import type { TActionCreator } from '@client/types';

const setColorModeAction: TActionCreator<ColorMode> =
  ({ setState }) =>
  (colorMode) =>
    setState((state) => ({
      ...state,
      colorMode,
    }));

export default setColorModeAction;
