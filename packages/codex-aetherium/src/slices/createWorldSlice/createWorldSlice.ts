// actions
import fetchWorldConfigAction from './actions/fetchWorldConfigAction';

// types
import type { TStateCreator } from '@client/types';
import type { ISlice } from './types';

const createWorldSlice: TStateCreator<ISlice> = (setState, getState) => {
  const api = { getState, setState };

  return {
    // state
    fetchingWorldConfig: false,
    worldConfig: null,
    // actions
    fetchWorldConfigAction: fetchWorldConfigAction(api),
  };
};

export default createWorldSlice;
