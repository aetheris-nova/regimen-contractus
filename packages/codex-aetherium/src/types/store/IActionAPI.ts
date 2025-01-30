import type { StoreApi } from 'zustand';

// types
import type TState from './TState';

interface IActionAPI {
  getState: StoreApi<TState>['getState'];
  setState: StoreApi<TState>['setState'];
}

export default IActionAPI;
