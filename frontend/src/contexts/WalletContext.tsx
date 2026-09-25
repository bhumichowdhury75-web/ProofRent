import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { createConnectedSession, type ConnectedSession } from '../lib/midnight';

type WalletType = '1am' | 'lace' | 'nightly' | null;
type WalletStatus = 'checking' | 'detected' | 'not-found';

export interface WalletContextType {
  address: string | null;
  coinPublicKey: string | null;
  isConnected: boolean;
  walletType: WalletType;
  isConnecting: boolean;
  walletStatus: WalletStatus;
  session: ConnectedSession | null;
  connectionError: string | null;
  connect: (network?: string) => Promise<ConnectedSession | undefined>;
  disconnect: () => void;
}

const WalletContext = createContext<WalletContextType | null>(null);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [address, setAddress] = useState<string | null>(null);
  const [coinPublicKey, setCoinPublicKey] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [walletType, setWalletType] = useState<WalletType>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [walletStatus, setWalletStatus] = useState<WalletStatus>('checking');
  const [session, setSession] = useState<ConnectedSession | null>(null);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const connectingRef = useRef(false);

  // Poll for injected Midnight wallets
  useEffect(() => {
    const startedAt = Date.now();
    const id = setInterval(() => {
      const w1am = (window as any).midnight?.['1am'];
      const wLace = (window as any).midnight?.mnLace;
      const wNightly = (window as any).midnight?.nightly;

      if (w1am) {
        setWalletType('1am');
        setWalletStatus('detected');
        clearInterval(id);
        return;
      }
      if (wLace) {
        setWalletType('lace');
        setWalletStatus('detected');
        clearInterval(id);
        return;
      }
      if (wNightly) {
        setWalletType('nightly');
        setWalletStatus('detected');
        clearInterval(id);
        return;
      }

      if (Date.now() - startedAt >= 6000) {
        setWalletStatus('not-found');
        clearInterval(id);
      }
    }, 300);

    return () => clearInterval(id);
  }, []);

  const connect = useCallback(async (network = 'preprod') => {
    if (connectingRef.current) return;
    connectingRef.current = true;
    setIsConnecting(true);
    setConnectionError(null);

    try {
      const wallet =
        (window as any).midnight?.['1am'] ??
        (window as any).midnight?.mnLace ??
        (window as any).midnight?.nightly;

      if (!wallet) {
        throw new Error('No Midnight-compatible wallet found. Please install 1AM or Lace wallet extension.');
      }

      const api = await wallet.connect(network);
      const sess = await createConnectedSession(api);

      setSession(sess);
      setAddress(sess.unshieldedAddress);
      setCoinPublicKey(sess.coinPublicKey);
      setIsConnected(true);
      return sess;
    } catch (e: any) {
      console.error('Midnight wallet connection error:', e);
      let errorMsg = e?.message ?? String(e);
      if (errorMsg.includes('Wallet is syncing')) {
        errorMsg = 'Wallet is syncing — please open your wallet extension and wait for sync to finish.';
      }
      setConnectionError(errorMsg);
      return undefined;
    } finally {
      connectingRef.current = false;
      setIsConnecting(false);
    }
  }, []);

  const disconnect = useCallback(() => {
    setAddress(null);
    setCoinPublicKey(null);
    setIsConnected(false);
    setSession(null);
    setConnectionError(null);
  }, []);

  return (
    <WalletContext.Provider
      value={{
        address,
        coinPublicKey,
        isConnected,
        walletType,
        isConnecting,
        walletStatus,
        session,
        connectionError,
        connect,
        disconnect,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}
