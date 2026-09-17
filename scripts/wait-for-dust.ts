import { WebSocket } from 'ws';
import { setNetworkId } from '@midnight-ntwrk/midnight-js-network-id';
import { FluentWalletBuilder } from '@midnight-ntwrk/testkit-js';

// @ts-expect-error WebSocket global polyfill for Node
globalThis.WebSocket = WebSocket;

const config = {
  networkId: 'undeployed',
  indexer: 'http://127.0.0.1:8088/api/v4/graphql',
  indexerWS: 'ws://127.0.0.1:8088/api/v4/graphql/ws',
  node: 'http://127.0.0.1:9944',
  nodeWS: 'ws://127.0.0.1:9944',
  proofServer: 'http://127.0.0.1:6300',
  faucet: '',
};

setNetworkId(config.networkId as any);

console.log('[ProofRent] Connecting to local Alice wallet...');
const wallet = await (FluentWalletBuilder as any).newWalletFromSeed(
  '0000000000000000000000000000000000000000000000000000000000000001',
  config as any,
);

console.log('[ProofRent] Waiting for DUST fees to accrue on local dev network...');
let attempts = 0;
while (attempts < 60) {
  try {
    const balance = await wallet.getBalance();
    if (balance > 0n) {
      console.log(`[ProofRent] DUST ready: ${balance}`);
      process.exit(0);
    }
  } catch {}
  await new Promise((r) => setTimeout(r, 4000));
  attempts++;
  console.log(`[ProofRent] Polling DUST balance... attempt ${attempts}`);
}
console.error('[ProofRent] DUST never arrived. Ensure Docker containers are healthy.');
process.exit(1);
