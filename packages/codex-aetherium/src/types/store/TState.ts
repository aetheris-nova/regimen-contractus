// types
import type { ISlice as ILayoutSlice } from '@client/slices/createLayoutSlice';
import type { ISlice as ISystemSlice } from '@client/slices/createSystemSlice';
import type { ISlice as IWorldSlice } from '@client/slices/createWorldSlice';

type TState = ILayoutSlice & ISystemSlice & IWorldSlice;

export default TState;
