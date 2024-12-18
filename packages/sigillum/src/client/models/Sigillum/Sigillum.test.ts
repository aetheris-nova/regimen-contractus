import { Arbiter } from '@aetherisnova/arbiter';
import { type CallExceptionError, type EthersError, JsonRpcProvider, Wallet } from 'ethers';
import { beforeAll, describe, expect, it, test } from 'vitest';

// constants
import { RECIPIENT_ALREADY_HAS_TOKEN, TOKEN_DOES_NOT_EXIST } from '@client/constants';

// models
import Sigillum from './Sigillum';

// utils
import { wait } from '@test/utils';
import ITokenMetadata from '../../types/ITokenMetadata';

describe(Sigillum.name, () => {
  const description = 'The Sigillum that proves membership to the Ordo Administratorum.';
  const name = 'Sigillum Ordo Administratorum';
  const symbol = 'SOA';
  let arbiterContract: Arbiter;
  let contract: Sigillum;
  let deployerSigner: Wallet;
  let notPermittedSigner: Wallet;
  let tokenHolderSigner: Wallet;
  let provider: JsonRpcProvider;

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

    provider = new JsonRpcProvider(process.env.RPC_URL);
    deployerSigner = new Wallet(process.env.ACCOUNT_0_PRIVATE_KEY, provider);
    notPermittedSigner = new Wallet(process.env.ACCOUNT_1_PRIVATE_KEY, provider);
    tokenHolderSigner = new Wallet(process.env.ACCOUNT_2_PRIVATE_KEY, provider);

    // deploy the arbiter contract
    arbiterContract = await Arbiter.deploy({
      provider,
      silent: true,
      signerAddress: deployerSigner.address,
    });
    // deploy the sigillum contract
    contract = await Sigillum.deploy({
      arbiter: arbiterContract.address(),
      description,
      name,
      provider,
      silent: true,
      signerAddress: deployerSigner.address,
      symbol,
    });
    // add the token contract to the arbiter contract
    await arbiterContract.addToken(contract.address());
    // mint a token holder
    await contract.mint(tokenHolderSigner.address);
  }, 60000);

  describe('burn()', () => {
    it('should throw and error if the issuer does not have permission to burn', async () => {
      const _contract = await Sigillum.attach({
        address: contract.address(),
        provider,
        signerAddress: notPermittedSigner.address,
        silent: true,
      });
      const { result } = await contract.mint(Wallet.createRandom(provider).address);

      try {
        await _contract.burn(result); // burn the token using un-permitted private key
      } catch (error) {
        expect((error as EthersError).code).toBe('CALL_EXCEPTION');

        return;
      }

      throw new Error('expected call exception error');
    });

    it('should throw and error if the there is no token', async () => {
      try {
        await contract.burn(BigInt('99'));
      } catch (error) {
        expect((error as EthersError).code).toBe('CALL_EXCEPTION');
        expect((error as CallExceptionError).reason).toBe(TOKEN_DOES_NOT_EXIST);

        return;
      }

      throw new Error('expected token does not exist error');
    });

    it('should burn a token', async () => {
      const recipient = Wallet.createRandom(provider);
      let currentSupply: bigint;
      let supply: bigint;

      const { result } = await contract.mint(recipient.address);
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
    it('should mint a new token', async () => {
      const recipient = Wallet.createRandom(provider);
      const supply = await contract.supply();
      let currentSupply: bigint;

      await contract.mint(recipient.address);
      currentSupply = await contract.supply();

      expect(currentSupply).toBe(supply + BigInt(1));
    });

    it('should throw and error if the issuer does not have permission to mint', async () => {
      const _contract = await Sigillum.attach({
        address: contract.address(),
        provider,
        signerAddress: notPermittedSigner.address,
        silent: true,
      });

      try {
        await _contract.mint(Wallet.createRandom(provider).address);
      } catch (error) {
        expect((error as EthersError).code).toBe('CALL_EXCEPTION');

        return;
      }

      throw new Error('expected call exception error');
    });

    it('should throw and error if the owner already has a token', async () => {
      const recipient = Wallet.createRandom(provider);

      try {
        await contract.mint(recipient.address);
        await contract.mint(recipient.address); // attempt to mint again
      } catch (error) {
        expect((error as EthersError).code).toBe('CALL_EXCEPTION');
        expect((error as CallExceptionError).reason).toBe(RECIPIENT_ALREADY_HAS_TOKEN);

        return;
      }

      throw new Error('expected owner already has token error');
    });
  });

  describe('propose()', () => {
    it('should error when the sender is not a token holder', async () => {
      const _contract = await Sigillum.attach({
        address: contract.address(),
        provider,
        signerAddress: notPermittedSigner.address,
        silent: true,
      });
      const now = new Date();

      try {
        await _contract.propose({
          title: 'Decree: Founding Of The Ordo Administratorum',
          start: BigInt((new Date().setDate(now.getDate() + 1) / 1000).toFixed(0)), // 24 hours later
          duration: BigInt(86400), // 1 day
        });
      } catch (error) {
        expect((error as EthersError).code).toBe('CALL_EXCEPTION');
        expect((error as CallExceptionError).reason).toBe(TOKEN_DOES_NOT_EXIST);

        return;
      }

      throw new Error('expected token does not exist error');
    });

    it('should create a proposal', async () => {
      const _contract = await Sigillum.attach({
        address: contract.address(),
        provider,
        signerAddress: tokenHolderSigner.address,
        silent: true,
      });
      const now = new Date();
      const duration = BigInt(86400); // 1 day
      const start = BigInt((new Date().setDate(now.getDate() + 1) / 1000).toFixed(0)); // 24 hours later
      const title = 'Decree: Founding Of The Ordo Administratorum';
      const result = await _contract.propose({
        duration,
        start,
        title,
      });
      const proposal = await arbiterContract.proposalByAddress(result.result);

      if (!proposal) {
        throw new Error(`proposal "${result.result}" not found`);
      }

      expect(proposal.duration).toEqual(duration);
      expect(proposal.proposer).toBe(tokenHolderSigner.address);
      expect(proposal.start).toEqual(start);
      expect(proposal.title).toBe(title);
    });
  });

  describe('tokenMetadata()', () => {
    it('should error when no token exists', async () => {
      try {
        await contract.tokenMetadata(BigInt('99'));
      } catch (error) {
        expect((error as EthersError).code).toBe('CALL_EXCEPTION');
        expect((error as CallExceptionError).reason).toBe(TOKEN_DOES_NOT_EXIST);

        return;
      }

      throw new Error('expected token does not exist error');
    });

    it('should return the token metadata', async () => {
      const recipient = Wallet.createRandom(provider);
      const { result } = await contract.mint(recipient.address); // mint a new token
      let tokenMetadata: ITokenMetadata;

      tokenMetadata = await contract.tokenMetadata(result);

      expect(tokenMetadata.arbiter.toLowerCase()).toBe(arbiterContract.address());
      expect(tokenMetadata.description).toBe(description);
      expect(tokenMetadata.id).toBe(Number(result));
      expect(tokenMetadata.name).toBe(name);
      expect(tokenMetadata.symbol).toBe(symbol);
    });
  });

  describe('vote()', () => {
    it('should error when the sender is not a token holder', async () => {
      const start = new Date();
      let _contract = await Sigillum.attach({
        address: contract.address(),
        provider,
        signerAddress: tokenHolderSigner.address,
        silent: true,
      });

      start.setSeconds(new Date().getSeconds() + 1); // 1 second later

      const { result } = await _contract.propose({
        duration: BigInt(86400), // 1 day
        start: BigInt((start.getTime() / 1000).toFixed(0)),
        title: 'Decree: Founding Of The Ordo Administratorum',
      });

      await wait(start.getTime() - new Date().getTime());

      // vote with a not permitted address
      _contract = await Sigillum.attach({
        address: contract.address(),
        provider,
        signerAddress: notPermittedSigner.address,
        silent: true,
      });

      try {
        await _contract.vote({
          choice: BigInt(0),
          proposal: result,
        });
      } catch (error) {
        expect((error as EthersError).code).toBe('CALL_EXCEPTION');
        expect((error as CallExceptionError).reason).toBe(TOKEN_DOES_NOT_EXIST);

        return;
      }

      throw new Error('expected token does not exist error');
    });

    it('should vote for a proposal', async () => {
      const _contract = await Sigillum.attach({
        address: contract.address(),
        provider,
        signerAddress: tokenHolderSigner.address,
        silent: true,
      });
      const start = new Date();

      start.setSeconds(new Date().getSeconds() + 1); // 1 second later

      const { result } = await _contract.propose({
        duration: BigInt(86400), // 1 day
        start: BigInt((start.getTime() / 1000).toFixed(0)),
        title: 'Decree: Founding Of The Ordo Administratorum',
      });

      await wait(start.getTime() - new Date().getTime());

      await _contract.vote({
        choice: BigInt(0),
        proposal: result,
      });
    });
  });
});
