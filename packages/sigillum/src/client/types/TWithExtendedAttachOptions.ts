// types
import { Sigillum } from '@client/models';

interface IWithExtendedAttachOptions {
  Class: typeof Sigillum;
}
type TWithExtendedAttachOptions<Type> = IWithExtendedAttachOptions & Type;

export default TWithExtendedAttachOptions;
