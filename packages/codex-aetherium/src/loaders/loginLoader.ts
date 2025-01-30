import { LoaderFunctionArgs, redirect } from 'react-router-dom';
import { UseAccountReturnType } from 'wagmi';

// types
import type { TState } from '@client/types';

export default function loginLoader({
  isConnected,
}: UseAccountReturnType): (args: LoaderFunctionArgs) => Response | null {
  return () => {
    if (isConnected) {
      return redirect('/');
    }

    return null;
  };
}
