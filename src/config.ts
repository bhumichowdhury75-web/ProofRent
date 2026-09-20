import type { EnvironmentConfiguration } from '@midnight-ntwrk/testkit-js';

export type NetworkConfig = EnvironmentConfiguration & {
  networkId: string;
  indexer: string;
  indexerWS: string;
  node: string;
  nodeWS: string;
  proofServer: string;
  faucet: string;
  walletNetworkId?: string;
};

export const LOCAL_CONFIG: NetworkConfig = {
  networkId: 'undeployed',
  walletNetworkId: 'Undeployed',
  indexer: 'http://localhost:8088/api/v4/graphql',
  indexerWS: 'ws://localhost:8088/api/v4/graphql/ws',
  node: 'http://localhost:9944',
  nodeWS: 'ws://localhost:9944',
  proofServer: 'http://localhost:6300',
  faucet: '',
};

export const PREPROD_CONFIG: NetworkConfig = {
  networkId: 'preprod',
  walletNetworkId: 'TestNet',
  indexer: 'https://indexer.preprod.midnight.network/api/v4/graphql',
  indexerWS: 'wss://indexer.preprod.midnight.network/api/v4/graphql/ws',
  node: 'https://rpc.preprod.midnight.network',
  nodeWS: 'wss://rpc.preprod.midnight.network',
  proofServer: process.env['MIDNIGHT_PROOF_SERVER'] ?? 'http://127.0.0.1:6300',
  faucet: 'https://faucet.preprod.midnight.network/api/drips',
};

export const PREVIEW_CONFIG: NetworkConfig = {
  networkId: 'preview',
  walletNetworkId: 'TestNet',
  indexer: 'https://indexer.preview.midnight.network/api/v4/graphql',
  indexerWS: 'wss://indexer.preview.midnight.network/api/v4/graphql/ws',
  node: 'https://rpc.preview.midnight.network',
  nodeWS: 'wss://rpc.preview.midnight.network',
  proofServer: process.env['MIDNIGHT_PROOF_SERVER'] ?? 'http://127.0.0.1:6300',
  faucet: 'https://faucet.preview.midnight.network/api/drips',
};

export function getConfig(): NetworkConfig {
  const network = (process.env['MIDNIGHT_NETWORK'] ?? 'local').toLowerCase();
  if (network === 'local' || network === 'undeployed') return LOCAL_CONFIG;
  if (network === 'preview') return PREVIEW_CONFIG;
  if (network === 'preprod') return PREPROD_CONFIG;
  return LOCAL_CONFIG;
}
