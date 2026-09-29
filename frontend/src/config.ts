// Network and contract configuration for ProofRent

export const NETWORK = (import.meta.env.VITE_MIDNIGHT_NETWORK ?? 'preprod').toLowerCase();

export const CONTRACT_ADDRESS_KEY = 'PROOFRENT_PREPROD_CONTRACT_ADDRESS';

export const getContractAddress = (): string => {
  const stored = localStorage.getItem(CONTRACT_ADDRESS_KEY);
  if (stored && /^(mn_addr_[a-zA-Z0-9]+|[0-9a-fA-F]{64})$/.test(stored.trim())) {
    return stored.trim();
  }
  const envAddr = import.meta.env.VITE_PREPROD_CONTRACT_ADDRESS;
  if (envAddr && /^(mn_addr_[a-zA-Z0-9]+|[0-9a-fA-F]{64})$/.test(envAddr.trim())) {
    return envAddr.trim();
  }
  return 'mn_addr_preprod1fjw64hh5veuayhl782sxggpq8jfp0vq0zvv3cvz94nv7cnzu9clqp3zk9e';
};

export const setStoredContractAddress = (address: string) => {
  localStorage.setItem(CONTRACT_ADDRESS_KEY, address.trim());
};

// Default policy criteria for rental reputation
export const DEFAULT_MIN_MONTHS = 12;
export const DEFAULT_MIN_PAYMENT_SCORE = 90; // 90% on-time payments
export const DEFAULT_MAX_VIOLATIONS = 0;     // 0 unresolved lease violations
export const DEFAULT_MIN_COMPLETED_LEASES = 1;

export const NETWORK_CONFIGS = {
  preprod: {
    networkId: 'preprod',
    name: 'Midnight Preprod Testnet',
    indexerUri: 'https://indexer.preprod.midnight.network/api/v4/graphql',
    indexerWsUri: 'wss://indexer.preprod.midnight.network/api/v4/graphql/ws',
    nodeRpc: 'https://rpc.preprod.midnight.network',
    explorer: 'https://preprod.midnightexplorer.com',
    faucet: 'https://faucet.preprod.midnight.network/api/drips',
  },
  preview: {
    networkId: 'preview',
    name: 'Midnight Preview Testnet',
    indexerUri: 'https://indexer.preview.midnight.network/api/v4/graphql',
    indexerWsUri: 'wss://indexer.preview.midnight.network/api/v4/graphql/ws',
    nodeRpc: 'https://rpc.preview.midnight.network',
    explorer: 'https://preview.midnightexplorer.com',
    faucet: 'https://faucet.preview.midnight.network/api/drips',
  },
  local: {
    networkId: 'undeployed',
    name: 'Local Devnet',
    indexerUri: 'http://localhost:8088/api/v4/graphql',
    indexerWsUri: 'ws://localhost:8088/api/v4/graphql/ws',
    nodeRpc: 'http://localhost:9944',
    explorer: '',
    faucet: '',
  },
};
