import { JsonRpcProvider, Wallet } from 'ethers';
import { beforeAll, describe, it } from 'vitest';

// models
import Sigillum from './Sigillum';

describe(Sigillum.name, () => {
  let deployerPrivateKey: string;
  let provider: JsonRpcProvider;
  let signer: Wallet;

  beforeAll(() => {
    if (!process.env.RPC_URL) {
      throw new Error('no rpc url set in the .env.test file');
    }

    if (!process.env.ACCOUNT_1_PRIVATE_KEY) {
      throw new Error('no account 1 private key set in the .env.test file');
    }

    deployerPrivateKey = process.env.ACCOUNT_1_PRIVATE_KEY;
    provider = new JsonRpcProvider(process.env.RPC_URL);
    signer = new Wallet(deployerPrivateKey, provider);
  });

  describe('when deploying a contract', () => {
    it('should deploy the contract', async () => {
      await Sigillum.deploy({
        description: 'The Sigillum that proves membership to the Ordo Administratorum.',
        name: 'Sigillum Ordo Administratorum',
        provider,
        symbol: 'SOA',
      });
    });
  });
});
