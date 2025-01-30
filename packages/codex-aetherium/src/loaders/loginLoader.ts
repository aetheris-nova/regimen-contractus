import { LoaderFunctionArgs, redirect } from 'react-router-dom';
import { UseAccountReturnType } from 'wagmi';

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
