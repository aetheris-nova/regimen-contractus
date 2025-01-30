import type { StateCreator as ZustandStateCreator } from 'zustand';

// types
import type TPersistedState from './TPersistedState';
import type TState from './TState';

type TStateCreator<Slice> = ZustandStateCreator<
  TState,
  [['zustand/devtools', never]],
  [['zustand/persist', TPersistedState]],
  Slice
>;

export default TStateCreator;
