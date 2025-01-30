// utils
import useStore from '@client/utils/useStore';

export default function useSelectIsAuthenticated(): boolean {
  return useStore((state) => false);
}
