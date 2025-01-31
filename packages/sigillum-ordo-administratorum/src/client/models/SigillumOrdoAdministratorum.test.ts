import { Arbiter, Proposal } from '@aetherisnova/arbiter';
import {
  ITokenMetadata,
  NOT_OWNER_OF_TOKEN,
  RECIPIENT_ALREADY_HAS_TOKEN,
  TOKEN_DOES_NOT_EXIST,
  VoteChoiceEnum,
} from '@aetherisnova/sigillum';
import { mock } from '@wagmi/connectors';
import { type Config as WagmiConfig, connect, createConfig } from '@wagmi/core';
import {
  type Address,
  CallExecutionError,
  ContractFunctionExecutionError,
  createWalletClient,
  type PrivateKeyAccount,
  webSocket,
} from 'viem';
import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts';
import { anvil } from 'viem/chains';
import { beforeAll, describe, expect, it, test } from 'vitest';

// enums
import { RankEnum } from '@client/enums';

// models
import SigillumOrdoAdministratorum from './SigillumOrdoAdministratorum';

// utils
import createProposal from '@test/utils/createProposal';
import wait from '@test/utils/wait';

describe(SigillumOrdoAdministratorum.name, () => {
  const description = 'The Sigillum that proves membership to the Ordo Administratorum.';
  const name = 'Sigillum Ordo Administratorum';
  const symbol = 'SOA';
  let deployerAccount: PrivateKeyAccount;
  let notPermittedAccount: PrivateKeyAccount;
  let tokenHolderAccount: PrivateKeyAccount;
  let tokenHolderRank: RankEnum;
  let tokenHolderTokenID: bigint;
  let wagmiConfig: WagmiConfig;
  let arbiterContract: Arbiter;
  let contract: SigillumOrdoAdministratorum;

  beforeAll(async () => {
    if (!process.env.RPC_URL) {
      throw new Error('no rpc url set in the .env.test file');
    }

    if (!process.env.ACCOUNT_0_PRIVATE_KEY) {
      throw new Error('no account 0 private key set in the .env.test file');
    }

    if (!process.env.ACCOUNT_1_PRIVATE_KEY) {
      throw new Error('no account 1 private key set in the .env.test file');
    }

    if (!process.env.ACCOUNT_2_PRIVATE_KEY) {
      throw new Error('no account 2 private key set in the .env.test file');
    }

    deployerAccount = privateKeyToAccount(process.env.ACCOUNT_0_PRIVATE_KEY as Address);
    notPermittedAccount = privateKeyToAccount(process.env.ACCOUNT_1_PRIVATE_KEY as Address);
    tokenHolderAccount = privateKeyToAccount(process.env.ACCOUNT_2_PRIVATE_KEY as Address);
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

    // deploy the arbiter contract
    arbiterContract = await Arbiter.deploy({
      // silent: true,
      wagmiConfig,
    });
    // deploy the sigillum contract
    contract = await SigillumOrdoAdministratorum.deploy({
      arbiter: arbiterContract.address(),
      description,
      name,
      silent: true,
      symbol,
      wagmiConfig,
    });
    // add the token contract to the arbiter contract
    await arbiterContract.addToken(contract.address());

    tokenHolderRank = RankEnum.Adeptus;

    // mint a token holder
    const { result } = await contract.mint(tokenHolderAccount.address, tokenHolderRank);

    tokenHolderTokenID = result;
  }, 60000);

  describe('burn()', () => {
    it('should throw and error if the burner does not have permission to burn', async () => {
      const _wagmiConfig = createConfig({
        chains: [anvil],
        client: ({ chain }) =>
          createWalletClient({
            chain,
            account: notPermittedAccount,
            transport: webSocket(),
          }),
      });
      let _contract: SigillumOrdoAdministratorum;

      await connect(_wagmiConfig, {
        connector: mock({
          accounts: [notPermittedAccount.address],
        }),
      });

      _contract = await SigillumOrdoAdministratorum.attach({
        address: contract.address(),
        silent: true,
        wagmiConfig: _wagmiConfig,
      });

      const { result } = await contract.mint(privateKeyToAccount(generatePrivateKey()).address, RankEnum.Novitiate);

      try {
        await _contract.burn(result); // burn the token using un-permitted private key
      } catch (error) {
        expect((error as CallExecutionError).name).toBe('CallExecutionError');

        return;
      }

      throw new Error('expected call exception error');
    });

    it('should throw and error if the there is no token', async () => {
      try {
        await contract.burn(BigInt('99'));
      } catch (error) {
        expect((error as CallExecutionError).name).toBe('CallExecutionError');
        expect((error as CallExecutionError).details).toContain(TOKEN_DOES_NOT_EXIST);

        return;
      }

      throw new Error('expected token does not exist error');
    });

    it('should burn a token', async () => {
      const recipient = privateKeyToAccount(generatePrivateKey());
      let currentSupply: bigint;
      let supply: bigint;

      const { result } = await contract.mint(recipient.address, RankEnum.Novitiate);
      supply = await contract.supply();

      await contract.burn(result);
      currentSupply = await contract.supply();

      expect(currentSupply).toBe(supply - BigInt(1));
    });
  });

  test('contractMetadata()', async () => {
    const result = await contract.contractMetadata();

    expect(result.arbiter.toLowerCase()).toBe(arbiterContract.address());
    expect(result.description).toBe(description);
    expect(result.name).toBe(name);
    expect(result.symbol).toBe(symbol);
  });

  describe('mint()', () => {
    it('should throw and error if the issuer does not have permission to mint', async () => {
      const _wagmiConfig = createConfig({
        chains: [anvil],
        client: ({ chain }) =>
          createWalletClient({
            chain,
            account: notPermittedAccount,
            transport: webSocket(),
          }),
      });
      let _contract: SigillumOrdoAdministratorum;

      await connect(_wagmiConfig, {
        connector: mock({
          accounts: [notPermittedAccount.address],
        }),
      });

      _contract = await SigillumOrdoAdministratorum.attach({
        address: contract.address(),
        silent: true,
        wagmiConfig: _wagmiConfig,
      });

      try {
        await _contract.mint(privateKeyToAccount(generatePrivateKey()).address, RankEnum.Novitiate);
      } catch (error) {
        expect((error as CallExecutionError).name).toBe('CallExecutionError');

        return;
      }

      throw new Error('expected call exception error');
    });

    it('should throw and error if the owner already has a token', async () => {
      const recipient = privateKeyToAccount(generatePrivateKey());

      try {
        await contract.mint(recipient.address, RankEnum.Novitiate);
        await contract.mint(recipient.address, RankEnum.Novitiate); // attempt to mint again
      } catch (error) {
        expect((error as CallExecutionError).name).toBe('CallExecutionError');
        expect((error as CallExecutionError).details).toContain(RECIPIENT_ALREADY_HAS_TOKEN);

        return;
      }

      throw new Error('expected owner already has token error');
    });

    it('should mint a new token', async () => {
      const recipient = privateKeyToAccount(generatePrivateKey());
      const supply = await contract.supply();
      let currentSupply: bigint;

      await contract.mint(recipient.address, RankEnum.Novitiate);
      currentSupply = await contract.supply();

      expect(currentSupply).toBe(supply + BigInt(1));
    });
  });

  describe('rank()', () => {
    it('should return null if no token exists for owner', async () => {
      const result = await contract.rank(notPermittedAccount.address);

      expect(result).toBeNull();
    });

    it('should return the rank', async () => {
      const result = await contract.rank(tokenHolderAccount.address);

      expect(result).toEqual(tokenHolderRank);
    });
  });

  describe('tokenMetadata()', () => {
    it('should error when no token exists', async () => {
      try {
        await contract.tokenMetadata(BigInt('99'));
      } catch (error) {
        expect((error as ContractFunctionExecutionError).name).toBe('ContractFunctionExecutionError');
        expect((error as ContractFunctionExecutionError).message).toContain(TOKEN_DOES_NOT_EXIST);

        return;
      }

      throw new Error('expected token does not exist error');
    });

    it('should return the token metadata', async () => {
      const recipient = privateKeyToAccount(generatePrivateKey());
      const { result } = await contract.mint(recipient.address, RankEnum.Novitiate); // mint a new token
      let tokenMetadata: ITokenMetadata;

      tokenMetadata = await contract.tokenMetadata(result);

      expect(tokenMetadata.arbiter.toLowerCase()).toBe(arbiterContract.address());
      expect(tokenMetadata.description).toBe(description);
      expect(tokenMetadata.id).toBe(Number(result));
      expect(tokenMetadata.name).toBe(name);
      expect(tokenMetadata.symbol).toBe(symbol);
    });
  });

  describe('tokenOf()', () => {
    it('should return null if no token exists for owner', async () => {
      const result = await contract.tokenOf(notPermittedAccount.address);

      expect(result).toBeNull();
    });

    it('should return the token ID', async () => {
      const result = await contract.tokenOf(tokenHolderAccount.address);

      expect(result).toEqual(tokenHolderTokenID);
    });
  });

  describe('vote()', () => {
    it('should error when the sender is not a token holder', async () => {
      const _wagmiConfig = createConfig({
        chains: [anvil],
        client: ({ chain }) =>
          createWalletClient({
            chain,
            account: notPermittedAccount,
            transport: webSocket(),
          }),
      });
      const start = new Date();
      let _contract: SigillumOrdoAdministratorum;
      let proposal: Proposal;

      start.setSeconds(new Date().getSeconds() + 1); // 1 second later

      proposal = await createProposal({
        contractAddress: arbiterContract.address(),
        duration: BigInt(86400), // 1 day
        proposer: tokenHolderAccount.address,
        start: BigInt((start.getTime() / 1000).toFixed(0)),
        title: 'Decree: Founding Of The Ordo Administratorum',
        wagmiConfig,
      });

      await connect(_wagmiConfig, {
        connector: mock({
          accounts: [notPermittedAccount.address],
        }),
      });

      // vote with a not permitted address
      _contract = await SigillumOrdoAdministratorum.attach({
        address: contract.address(),
        silent: true,
        wagmiConfig: _wagmiConfig,
      });

      // let the time pass to start the proposal
      await wait(start.getTime() - new Date().getTime());

      try {
        await _contract.vote({
          choice: VoteChoiceEnum.Accept,
          proposal: proposal.address(),
          tokenID: tokenHolderTokenID, // use a token that is not owned by the token signer
        });
      } catch (error) {
        expect((error as CallExecutionError).name).toBe('CallExecutionError');
        expect((error as CallExecutionError).message).toContain(NOT_OWNER_OF_TOKEN);

        return;
      }

      throw new Error('expected token does not exist error');
    });

    it('should vote for a proposal', async () => {
      const _wagmiConfig = createConfig({
        chains: [anvil],
        client: ({ chain }) =>
          createWalletClient({
            chain,
            account: tokenHolderAccount,
            transport: webSocket(),
          }),
      });
      const start = new Date();
      let _contract: SigillumOrdoAdministratorum;
      let proposal: Proposal;

      start.setSeconds(new Date().getSeconds() + 1); // 1 second later

      proposal = await createProposal({
        contractAddress: arbiterContract.address(),
        duration: BigInt(86400), // 1 day
        proposer: tokenHolderAccount.address,
        start: BigInt((start.getTime() / 1000).toFixed(0)),
        title: 'Decree: Founding Of The Ordo Administratorum',
        wagmiConfig,
      });

      await connect(_wagmiConfig, {
        connector: mock({
          accounts: [tokenHolderAccount.address],
        }),
      });

      _contract = await SigillumOrdoAdministratorum.attach({
        address: contract.address(),
        silent: true,
        wagmiConfig: _wagmiConfig,
      });

      // let the time pass to start the proposal
      await wait(start.getTime() - new Date().getTime());

      await _contract.vote({
        choice: VoteChoiceEnum.Accept,
        proposal: proposal.address(),
        tokenID: tokenHolderTokenID,
      });
    });
  });
});
