// types
import type { TActionCreator } from '@client/types';
import type { ILoadingModalDetails } from '@client/slices/createLayoutSlice';

const setLoadingModalDetailsAction: TActionCreator<ILoadingModalDetails | null> =
  ({ setState }) =>
  (loadingModalDetails) =>
    setState((state) => ({
      ...state,
      loadingModalDetails,
    }));

export default setLoadingModalDetailsAction;
