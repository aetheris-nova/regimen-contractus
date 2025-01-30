// types
import type { TActionCreator } from '@client/types';

const setTitleAction: TActionCreator<string> =
  ({ setState }) =>
  (title) =>
    setState((state) => ({
      ...state,
      title,
    }));

export default setTitleAction;
