// types
import type IActionAPI from './IActionAPI';

type TActionCreator<Payload = undefined, Return = void> = (api: IActionAPI) => (payload: Payload) => Return;

export default TActionCreator;
