import { Sigillum } from '@aetherisnova/sigillum';
import { JsonRpcProvider, Wallet } from 'ethers';
import { beforeAll, beforeEach, describe, expect, it } from 'vitest';

// models
import Arbiter from './Arbiter';

describe(Arbiter.name, () => {
  let contract: Arbiter;
  let deployerSigner: Wallet;
  let provider: JsonRpcProvider;
  let tokenContract: Sigillum;

  beforeAll(async () => {
    if (!process.env.RPC_URL) {
      throw new Error('no rpc url set in the .env.test file');
    }

    if (!process.env.ACCOUNT_0_PRIVATE_KEY) {
      throw new Error('no account 0 private key set in the .env.test file');
    }

    provider = new JsonRpcProvider(process.env.RPC_URL);
    deployerSigner = new Wallet(process.env.ACCOUNT_0_PRIVATE_KEY, provider);
    contract = await Arbiter.deploy({
      provider,
      silent: true,
      signerAddress: deployerSigner.address,
    });
  }, 60000);

  beforeEach(async () => {
    tokenContract = await Sigillum.deploy({
      arbiter: contract.address(),
      description: 'The Sigillum that proves membership to the Ordo Administratorum.',
      name: 'Sigillum Ordo Administratorum',
      provider,
      silent: true,
      signerAddress: deployerSigner.address,
      symbol: 'SOA',
    });
  });

  describe('addExecutor()', () => {
    it('should add executor privileges', async () => {
      const account = Wallet.createRandom(provider);
      let isExecutor = await contract.isExecutor(account.address);

      expect(isExecutor).toBe(false);

      await contract.addExecutor(account.address);

      isExecutor = await contract.isExecutor(account.address);

      expect(isExecutor).toBe(true);
    });
  });

  describe('addToken()', () => {
    it('should add a token to vote', async () => {
      let canVote = await contract.eligibility(tokenContract.address());

      expect(canVote).toBe(false);

      await contract.addToken(tokenContract.address());

      canVote = await contract.eligibility(tokenContract.address());

      expect(canVote).toBe(true);
    });
  });

  describe('removeExecutor()', () => {
    it('should remove executor privileges', async () => {
      // arrange
      const account = Wallet.createRandom(provider);
      let isExecutor: boolean;

      await contract.addExecutor(account.address);

      isExecutor = await contract.isExecutor(account.address);

      expect(isExecutor).toBe(true);

      // assert
      await contract.removeExecutor(account.address);

      // act
      isExecutor = await contract.isExecutor(account.address);

      expect(isExecutor).toBe(false);
    });
  });

  describe('removeToken()', () => {
    it('should remove a token to vote', async () => {
      // arrange
      let canVote: boolean;

      await contract.addToken(tokenContract.address());

      canVote = await contract.eligibility(tokenContract.address());

      expect(canVote).toBe(true);

      // assert
      await contract.removeToken(tokenContract.address());

      // act
      canVote = await contract.eligibility(tokenContract.address());

      expect(canVote).toBe(false);
    });
  });
});
