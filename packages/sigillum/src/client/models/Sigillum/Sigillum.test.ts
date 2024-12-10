import { type CallExceptionError, type EthersError, JsonRpcProvider, Wallet } from 'ethers';
import { beforeAll, describe, expect, it, test } from 'vitest';

// constants
import { RECIPIENT_ALREADY_HAS_TOKEN, TOKEN_DOES_NOT_EXIST } from '@client/constants';

// models
import Sigillum from './Sigillum';

describe(Sigillum.name, () => {
  const description = 'The Sigillum that proves membership to the Ordo Administratorum.';
  const name = 'Sigillum Ordo Administratorum';
  const symbol = 'SOA';
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
      description,
      name,
      provider,
      silent: true,
      symbol,
    });
  });

  describe('burn()', () => {
    it('should mint a new token', async () => {
      const recipient = Wallet.createRandom(provider);
      const supply: bigint = await contract.supply();
      let currentSupply: bigint;

      await contract.mint(recipient.address);
      currentSupply = await contract.supply();

      expect(currentSupply).toBe(supply + BigInt(1));
    });

    it.only('should throw and error if the there is no token', async () => {
      try {
        await contract.burn(BigInt('99'));
      } catch (error) {
        expect((error as EthersError).code).toBe('CALL_EXCEPTION');
        expect((error as CallExceptionError).reason).toBe(TOKEN_DOES_NOT_EXIST);

        return;
      }

      throw new Error('expected token does not exist error');
    });
  });

  test('contractMetadata()', async () => {
    const result = await contract.contractMetadata();

    expect(result.description).toBe(description);
    expect(result.name).toBe(name);
    expect(result.symbol).toBe(symbol);
  });

  describe('mint()', () => {
    it('should mint a new token', async () => {
      const recipient = Wallet.createRandom(provider);
      const supply: bigint = await contract.supply();
      let currentSupply: bigint;

      await contract.mint(recipient.address);
      currentSupply = await contract.supply();

      expect(currentSupply).toBe(supply + BigInt(1));
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

  describe('tokenURI()', () => {
    it('should error when no token exists', async () => {
      try {
        await contract.tokenURI(BigInt('99'));
      } catch (error) {
        expect((error as EthersError).code).toBe('CALL_EXCEPTION');
        expect((error as CallExceptionError).reason).toBe(TOKEN_DOES_NOT_EXIST);

        return;
      }

      throw new Error('expected token does not exist error');
    });
  });
});
