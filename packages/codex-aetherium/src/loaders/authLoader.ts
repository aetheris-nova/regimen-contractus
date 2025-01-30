import { LoaderFunctionArgs, redirect } from 'react-router-dom';
import { UseAccountReturnType } from 'wagmi';

// constants
import { LOGIN_ROUTE } from '@client/constants';

export default function authLoader({
  isConnected,
}: UseAccountReturnType): (args: LoaderFunctionArgs) => Response | null {
  return ({ request }) => {
    let params: URLSearchParams;

    if (!isConnected) {
      params = new URLSearchParams();

      params.set('from', new URL(request.url).pathname);

      return redirect(`${LOGIN_ROUTE}?` + params.toString());
    }

    return null;
  };
}
