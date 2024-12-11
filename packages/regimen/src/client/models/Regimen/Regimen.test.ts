import { Sigillum } from '@aetherisnova/sigillum';
import { JsonRpcProvider, Wallet } from 'ethers';
import { beforeAll, beforeEach, describe, expect, it } from 'vitest';

// models
import Regimen from './Regimen';

describe(Regimen.name, () => {
  let contract: Regimen;
  let deployerSigner: Wallet;
  let provider: JsonRpcProvider;
  let tokenContract: Sigillum;

  beforeAll(async () => {
    if (!process.env.RPC_URL) {
      throw new Error('no rpc url set in the .env.test file');
    }

    if (!process.env.ACCOUNT_1_PRIVATE_KEY) {
      throw new Error('no account 1 private key set in the .env.test file');
    }

    provider = new JsonRpcProvider(process.env.RPC_URL);
    deployerSigner = new Wallet(process.env.ACCOUNT_1_PRIVATE_KEY, provider);
    contract = await Regimen.deploy({
      provider,
      silent: true,
      signerAddress: deployerSigner.address,
    });
  });

  beforeEach(async () => {
    tokenContract = await Sigillum.deploy({
      description: 'The Sigillum that proves membership to the Ordo Administratorum.',
      name: 'Sigillum Ordo Administratorum',
      provider,
      silent: true,
      signerAddress: deployerSigner.address,
      symbol: 'SOA',
    });
  });

  describe('addToken()', () => {
    it('should add a token to vote', async () => {
      let canVote = await contract.canVote(tokenContract.address());

      expect(canVote).toBe(false);

      await contract.addToken(tokenContract.address());

      canVote = await contract.canVote(tokenContract.address());

      expect(canVote).toBe(true);
    });
  });

  describe('removeToken()', () => {
    it('should remove a token to vote', async () => {
      // arrange
      let canVote: boolean;

      await contract.addToken(tokenContract.address());

      canVote = await contract.canVote(tokenContract.address());

      expect(canVote).toBe(true);

      // assert
      await contract.removeToken(tokenContract.address());

      // act
      canVote = await contract.canVote(tokenContract.address());

      expect(canVote).toBe(false);
    });
  });
});
