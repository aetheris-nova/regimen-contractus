import { Sigillum } from '@aetherisnova/sigillum';
import { mock } from '@wagmi/connectors';
import { type Config as WagmiConfig, createConfig, connect } from '@wagmi/core';
import { type Address, createWalletClient, type PrivateKeyAccount, webSocket } from 'viem';
import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts';
import { anvil } from 'viem/chains';
import { beforeAll, beforeEach, describe, expect, it } from 'vitest';

// models
import Arbiter from './Arbiter';
import Proposal from './Proposal';

describe(Arbiter.name, () => {
  let contract: Arbiter;
  let deployerAccount: PrivateKeyAccount;
  let wagmiConfig: WagmiConfig;
  let tokenContract: Sigillum;

  beforeAll(async () => {
    if (!process.env.ACCOUNT_0_PRIVATE_KEY) {
      throw new Error('no account 0 private key set in the .env.test file');
    }

    deployerAccount = privateKeyToAccount(process.env.ACCOUNT_0_PRIVATE_KEY as Address);
    wagmiConfig = createConfig({
      chains: [anvil],
      client: ({ chain }) =>
        createWalletClient({
          chain,
          account: deployerAccount,
          transport: webSocket(),
        }),
    });

    await connect(wagmiConfig, {
      connector: mock({
        accounts: [deployerAccount.address],
      }),
    });

    contract = await Arbiter.deploy({
      silent: true,
      wagmiConfig,
    });
  }, 60000);

  beforeEach(async () => {
    tokenContract = await Sigillum.deploy({
      arbiter: contract.address(),
      description: 'The Sigillum that proves membership to the Ordo Administratorum.',
      name: 'Sigillum Ordo Administratorum',
      silent: true,
      symbol: 'SOA',
      wagmiConfig,
    });
  });

  describe('addExecutor()', () => {
    it('should add executor privileges', async () => {
      const account = privateKeyToAccount(generatePrivateKey());
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

  describe('propose()', () => {
    it('should create a proposal', async () => {
      const duration = BigInt(86400); // 1 day
      const now = new Date();
      const proposerAccount = privateKeyToAccount(generatePrivateKey());
      const start = BigInt((new Date().setDate(now.getDate() + 1) / 1000).toFixed(0)); // 24 hours later
      const title = 'Decree: Founding Of The Ordo Administratorum';
      const { result } = await contract.propose({
        duration,
        proposer: proposerAccount.address,
        start,
        title,
      });
      const proposalContract = await Proposal.attach({
        address: result,
        silent: true,
        wagmiConfig,
      });
      const details = await proposalContract.details();

      expect(details.duration).toEqual(duration);
      expect(details.proposer).toBe(proposerAccount.address);
      expect(details.start).toEqual(start);
      expect(details.title).toBe(title);
    });
  });

  describe('removeExecutor()', () => {
    it('should remove executor privileges', async () => {
      // arrange
      const account = privateKeyToAccount(generatePrivateKey());
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
