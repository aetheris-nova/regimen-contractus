import { useForegroundColor as _useForegroundColor } from '@aetherisnova/ui-components';

// selectors
import { useSelectColorMode } from '@client/selectors';

export default function useForegroundColor(): string {
  const colorMode = useSelectColorMode();

  return _useForegroundColor(colorMode);
}
