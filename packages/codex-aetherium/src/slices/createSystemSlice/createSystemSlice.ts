import { createLogger } from '@aetherisnova/utils';

// types
import type { TStateCreator } from '@client/types';
import type { ISlice } from './types';

const createSystemSlice: TStateCreator<ISlice> = () => {
  return {
    // state
    logger: createLogger(import.meta.env.DEV ? 'debug' : 'error'),
  };
};

export default createSystemSlice;
