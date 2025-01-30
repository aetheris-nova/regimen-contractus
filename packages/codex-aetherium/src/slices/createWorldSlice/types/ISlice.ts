// types
import type { IWorldConfigWithExtendedProps } from '@aetherisnova/types';

interface ISlice {
  // state
  worldConfig: IWorldConfigWithExtendedProps | null;
  isFetchingWorldConfig: boolean;
  // actions
  fetchWorldConfigAction: (payload?: undefined) => Promise<IWorldConfigWithExtendedProps>;
}

export default ISlice;
