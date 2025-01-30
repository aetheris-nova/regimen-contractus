import { useBackgroundColor as _useBackgroundColor } from '@aetherisnova/ui-components';

// selectors
import { useSelectColorMode } from '@client/selectors';

export default function useBackgroundColor(): string {
  const colorMode = useSelectColorMode();

  return _useBackgroundColor(colorMode);
}
