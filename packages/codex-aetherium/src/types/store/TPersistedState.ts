// types
import type TState from './TState';

type TPersistedState = Pick<TState, 'colorMode' | 'worldConfig'>;

export default TPersistedState;
