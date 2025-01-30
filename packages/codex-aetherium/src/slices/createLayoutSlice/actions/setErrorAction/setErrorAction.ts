import { BaseError } from '@aetherisnova/errors';

// types
import type { TActionCreator } from '@client/types';

const setErrorAction: TActionCreator<BaseError | null> =
  ({ setState }) =>
  (error) =>
    setState((state) => ({
      ...state,
      error,
    }));

export default setErrorAction;
