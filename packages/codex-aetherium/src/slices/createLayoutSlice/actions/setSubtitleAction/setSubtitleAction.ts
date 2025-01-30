// types
import type { TActionCreator } from '@client/types';

const setSubtitleAction: TActionCreator<string> =
  ({ setState }) =>
  (subtitle) =>
    setState((state) => ({
      ...state,
      subtitle,
    }));

export default setSubtitleAction;
