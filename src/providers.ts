import type { ProofRentWalletProvider } from './wallet.js';

export type ProofRentProviders = {
  walletProvider: ProofRentWalletProvider;
  publicDataProvider: {
    queryContractState: (address: string) => Promise<{ data: any } | null>;
  };
  zkConfigProvider: {
    getZkConfig: (circuitId: string) => Promise<any>;
  };
  proofProvider: {
    prove: (circuitId: string, args: any) => Promise<any>;
  };
};

export function buildProviders(
  wallet: ProofRentWalletProvider,
  _zkConfigPath: string,
  _config: any,
): ProofRentProviders {
  return {
    walletProvider: wallet,
    publicDataProvider: {
      queryContractState: async (_address: string) => null,
    },
    zkConfigProvider: {
      getZkConfig: async (_circuitId: string) => null,
    },
    proofProvider: {
      prove: async (_circuitId: string, _args: any) => null,
    },
  };
}
