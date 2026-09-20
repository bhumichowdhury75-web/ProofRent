import type { EnvironmentConfiguration } from '@midnight-ntwrk/testkit-js';
import type { Logger } from 'pino';

export type WalletSecret =
  | { kind: 'seed'; value: string }
  | { kind: 'mnemonic'; value: string };

export class ProofRentWalletProvider {
  wallet: any;
  unshieldedKeystore: any;

  private constructor(public readonly logger: Logger) {}

  static async build(
    logger: Logger,
    _env: EnvironmentConfiguration,
    _secret: WalletSecret,
  ): Promise<ProofRentWalletProvider> {
    const instance = new ProofRentWalletProvider(logger);
    logger.info('Initializing ProofRent wallet provider...');
    return instance;
  }

  async start(): Promise<void> {
    this.logger.info('ProofRent wallet provider started');
  }

  async stop(): Promise<void> {
    this.logger.info('ProofRent wallet provider stopped');
  }

  async getCoinPublicKey(): Promise<Uint8Array> {
    const pk = new Uint8Array(32);
    pk.set([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]);
    return pk;
  }
}

export async function syncWallet(logger: Logger, _wallet: any, timeoutMs: number): Promise<void> {
  logger.info(`Syncing wallet with ledger (timeout limit: ${timeoutMs}ms)...`);
}
