import type { IWorldConfigWithExtendedProps, TSmartCharacterWithExtendedProps } from '@aetherisnova/types';
import type { ColorMode } from '@chakra-ui/color-mode';

interface IProps {
  account: TSmartCharacterWithExtendedProps | null;
  colorMode: ColorMode;
  fetchingWorldConfig: boolean;
  onDisconnectClick: () => void;
  worldConfig: IWorldConfigWithExtendedProps | null;
}

export default IProps;
