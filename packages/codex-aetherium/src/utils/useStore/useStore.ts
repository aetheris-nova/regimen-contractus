import { isLocalStorageAvailable } from '@aetherisnova/utils';
import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';

// constants
import { STORE_NAME } from '@client/constants';

// slices
import createAccountSlice from '@client/slices/createAccountSlice';
import createLayoutSlice from '@client/slices/createLayoutSlice';
import createSystemSlice from '@client/slices/createSystemSlice';
import createWorldSlice from '@client/slices/createWorldSlice';

// types
import type { TState } from '@client/types';

const useStore = create<TState>()(
  devtools(
    persist(
      (...api) => ({
        ...createAccountSlice(...api),
        ...createLayoutSlice(...api),
        ...createSystemSlice(...api),
        ...createWorldSlice(...api),
      }),
      {
        name: STORE_NAME,
        partialize: ({ accounts, colorMode, worldConfig }) => ({
          accounts,
          colorMode,
          worldConfig,
        }),
        storage: createJSONStorage(() => (isLocalStorageAvailable() ? window.localStorage : window.sessionStorage)),
        version: 0,
      }
    ),
    {
      name: STORE_NAME,
    }
  )
);

export default useStore;
