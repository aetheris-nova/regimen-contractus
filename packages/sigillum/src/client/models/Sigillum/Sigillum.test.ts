import { JsonRpcProvider, Wallet } from 'ethers';
import { beforeAll, beforeEach, describe, expect, test } from 'vitest';

// models
import Sigillum from './Sigillum';

describe(Sigillum.name, () => {
  let contract: Sigillum;
  let deployerPrivateKey: string;
  let provider: JsonRpcProvider;
  let signer: Wallet;

  beforeAll(async () => {
    if (!process.env.RPC_URL) {
      throw new Error('no rpc url set in the .env.test file');
    }

    if (!process.env.ACCOUNT_1_PRIVATE_KEY) {
      throw new Error('no account 1 private key set in the .env.test file');
    }

    deployerPrivateKey = process.env.ACCOUNT_1_PRIVATE_KEY;
    provider = new JsonRpcProvider(process.env.RPC_URL);
    signer = new Wallet(deployerPrivateKey, provider);
    contract = await Sigillum.deploy({
      description: 'The Sigillum that proves membership to the Ordo Administratorum.',
      name: 'Sigillum Ordo Administratorum',
      provider,
      symbol: 'SOA',
    });
  });

  test.only('contractMetadata()', async () => {
    const result = await contract.contractMetadata();

    expect(result.description).toBe('The Sigillum that proves membership to the Ordo Administratorum.');
    expect(result.name).toBe('Sigillum Ordo Administratorum');
    expect(result.symbol).toBe('SOA');
  });
});
