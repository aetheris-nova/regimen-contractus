// types
import type TState from './TState';

type TPersistedState = Pick<TState, 'accounts' | 'colorMode' | 'selectedAccountAddress' | 'worldConfig'>;

export default TPersistedState;
