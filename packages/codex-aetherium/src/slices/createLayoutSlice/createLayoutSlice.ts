// actions
import setColorModeAction from './actions/setColorModeAction';
import setErrorAction from './actions/setErrorAction';
import setLoadingModalDetailsAction from './actions/setLoadingModalDetailsAction';
import setSubtitleAction from './actions/setSubtitleAction';
import setTitleAction from './actions/setTitleAction';

// types
import type { TStateCreator } from '@client/types';
import type { ISlice } from './types';

const createLayoutSlice: TStateCreator<ISlice> = (setState, getState) => {
  const api = { getState, setState };

  return {
    // state
    colorMode: 'light',
    error: null,
    loadingModalDetails: null,
    subtitle: null,
    title: null,
    // actions
    setColorModeAction: setColorModeAction(api),
    setErrorAction: setErrorAction(api),
    setLoadingModalDetailsAction: setLoadingModalDetailsAction(api),
    setSubtitleAction: setSubtitleAction(api),
    setTitleAction: setTitleAction(api),
  };
};

export default createLayoutSlice;
