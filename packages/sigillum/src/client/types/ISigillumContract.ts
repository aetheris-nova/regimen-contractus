import type { BaseContract } from 'ethers';

interface ISigillumContract extends BaseContract {
  readonly contractURI: () => Promise<string>;
  readonly tokenURI: (id: bigint) => Promise<string>;
}

export default ISigillumContract;
