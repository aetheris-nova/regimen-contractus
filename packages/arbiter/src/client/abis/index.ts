//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Arbiter
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const arbiterAbi = [
  { type: 'constructor', inputs: [], stateMutability: 'nonpayable' },
  {
    type: 'function',
    inputs: [],
    name: 'CUSTODIAN_ROLE',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'DEFAULT_ADMIN_ROLE',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'EXECUTOR_ROLE',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'token', internalType: 'address', type: 'address' }],
    name: 'addToken',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'proposal', internalType: 'address', type: 'address' }],
    name: 'cancel',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'token', internalType: 'address', type: 'address' }],
    name: 'eligibility',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'proposal', internalType: 'address', type: 'address' }],
    name: 'execute',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'role', internalType: 'bytes32', type: 'bytes32' }],
    name: 'getRoleAdmin',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'role', internalType: 'bytes32', type: 'bytes32' },
      { name: 'account', internalType: 'address', type: 'address' },
    ],
    name: 'grantRole',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'role', internalType: 'bytes32', type: 'bytes32' },
      { name: 'account', internalType: 'address', type: 'address' },
    ],
    name: 'hasRole',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'tokenID', internalType: 'uint256', type: 'uint256' },
      { name: 'proposal', internalType: 'address', type: 'address' },
    ],
    name: 'hasVoted',
    outputs: [
      { name: '', internalType: 'uint8', type: 'uint8' },
      { name: '', internalType: 'bool', type: 'bool' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'proposer', internalType: 'address', type: 'address' },
      { name: 'title', internalType: 'string', type: 'string' },
      { name: 'start', internalType: 'uint48', type: 'uint48' },
      { name: 'duration', internalType: 'uint32', type: 'uint32' },
    ],
    name: 'propose',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'token', internalType: 'address', type: 'address' }],
    name: 'removeToken',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'role', internalType: 'bytes32', type: 'bytes32' },
      { name: 'callerConfirmation', internalType: 'address', type: 'address' },
    ],
    name: 'renounceRole',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'role', internalType: 'bytes32', type: 'bytes32' },
      { name: 'account', internalType: 'address', type: 'address' },
    ],
    name: 'revokeRole',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'interfaceId', internalType: 'bytes4', type: 'bytes4' }],
    name: 'supportsInterface',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'version',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'tokenID', internalType: 'uint256', type: 'uint256' },
      { name: 'proposal', internalType: 'address', type: 'address' },
      { name: 'choice', internalType: 'uint8', type: 'uint8' },
    ],
    name: 'vote',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [{ name: '', internalType: 'string', type: 'string', indexed: false }],
    name: 'Debug',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'contractAddress', internalType: 'address', type: 'address', indexed: false },
      { name: 'proposer', internalType: 'address', type: 'address', indexed: false },
      { name: 'start', internalType: 'uint48', type: 'uint48', indexed: false },
      { name: 'duration', internalType: 'uint32', type: 'uint32', indexed: false },
    ],
    name: 'ProposalCreated',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'role', internalType: 'bytes32', type: 'bytes32', indexed: true },
      { name: 'previousAdminRole', internalType: 'bytes32', type: 'bytes32', indexed: true },
      { name: 'newAdminRole', internalType: 'bytes32', type: 'bytes32', indexed: true },
    ],
    name: 'RoleAdminChanged',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'role', internalType: 'bytes32', type: 'bytes32', indexed: true },
      { name: 'account', internalType: 'address', type: 'address', indexed: true },
      { name: 'sender', internalType: 'address', type: 'address', indexed: true },
    ],
    name: 'RoleGranted',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'role', internalType: 'bytes32', type: 'bytes32', indexed: true },
      { name: 'account', internalType: 'address', type: 'address', indexed: true },
      { name: 'sender', internalType: 'address', type: 'address', indexed: true },
    ],
    name: 'RoleRevoked',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [{ name: 'token', internalType: 'address', type: 'address', indexed: true }],
    name: 'TokenAdded',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [{ name: 'token', internalType: 'address', type: 'address', indexed: true }],
    name: 'TokenRemoved',
  },
  { type: 'error', inputs: [], name: 'AccessControlBadConfirmation' },
  {
    type: 'error',
    inputs: [
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'neededRole', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'AccessControlUnauthorizedAccount',
  },
] as const;

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Proposal
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const proposalAbi = [
  {
    type: 'constructor',
    inputs: [
      { name: 'proposer', internalType: 'address', type: 'address' },
      { name: 'title', internalType: 'string', type: 'string' },
      { name: 'start', internalType: 'uint48', type: 'uint48' },
      { name: 'duration', internalType: 'uint32', type: 'uint32' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'abstainVotes',
    outputs: [{ name: '', internalType: 'uint32', type: 'uint32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'acceptVotes',
    outputs: [{ name: '', internalType: 'uint32', type: 'uint32' }],
    stateMutability: 'view',
  },
  { type: 'function', inputs: [], name: 'cancel', outputs: [], stateMutability: 'nonpayable' },
  {
    type: 'function',
    inputs: [],
    name: 'details',
    outputs: [
      { name: 'canceled', internalType: 'bool', type: 'bool' },
      { name: 'duration', internalType: 'uint32', type: 'uint32' },
      { name: 'executed', internalType: 'bool', type: 'bool' },
      { name: 'proposer', internalType: 'address', type: 'address' },
      { name: 'start', internalType: 'uint48', type: 'uint48' },
      { name: 'title', internalType: 'string', type: 'string' },
    ],
    stateMutability: 'view',
  },
  { type: 'function', inputs: [], name: 'execute', outputs: [], stateMutability: 'nonpayable' },
  {
    type: 'function',
    inputs: [
      { name: 'token', internalType: 'address', type: 'address' },
      { name: 'tokenID', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'hasVoted',
    outputs: [
      {
        name: '',
        internalType: 'struct Proposal.Vote',
        type: 'tuple',
        components: [
          { name: 'vote', internalType: 'uint8', type: 'uint8' },
          { name: 'voted', internalType: 'bool', type: 'bool' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'owner',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'rejectVotes',
    outputs: [{ name: '', internalType: 'uint32', type: 'uint32' }],
    stateMutability: 'view',
  },
  { type: 'function', inputs: [], name: 'renounceOwnership', outputs: [], stateMutability: 'nonpayable' },
  {
    type: 'function',
    inputs: [{ name: 'newOwner', internalType: 'address', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'version',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'token', internalType: 'address', type: 'address' },
      { name: 'tokenID', internalType: 'uint256', type: 'uint256' },
      { name: 'choice', internalType: 'uint8', type: 'uint8' },
    ],
    name: 'vote',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'voteResults',
    outputs: [
      { name: '', internalType: 'uint32', type: 'uint32' },
      { name: '', internalType: 'uint32', type: 'uint32' },
      { name: '', internalType: 'uint32', type: 'uint32' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'previousOwner', internalType: 'address', type: 'address', indexed: true },
      { name: 'newOwner', internalType: 'address', type: 'address', indexed: true },
    ],
    name: 'OwnershipTransferred',
  },
  { type: 'event', anonymous: false, inputs: [], name: 'ProposalCanceled' },
  { type: 'event', anonymous: false, inputs: [], name: 'ProposalExecuted' },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'token', internalType: 'address', type: 'address', indexed: false },
      { name: 'tokenID', internalType: 'uint256', type: 'uint256', indexed: false },
    ],
    name: 'Voted',
  },
  { type: 'error', inputs: [{ name: 'owner', internalType: 'address', type: 'address' }], name: 'OwnableInvalidOwner' },
  {
    type: 'error',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'OwnableUnauthorizedAccount',
  },
] as const;
