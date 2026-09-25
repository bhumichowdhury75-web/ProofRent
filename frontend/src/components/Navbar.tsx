import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useWallet } from '../contexts/WalletContext';
import {
  Shield,
  Key,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  ChevronDown,
  Menu,
  X,
  Cpu,
} from 'lucide-react';
import { NETWORK_CONFIGS } from '../config';

export function Navbar() {
  const location = useLocation();
  const {
    address,
    isConnected,
    isConnecting,
    walletType,
    walletStatus,
    connectionError,
    connect,
    disconnect,
  } = useWallet();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [walletDropdownOpen, setWalletDropdownOpen] = useState(false);

  const navLinks = [
    { path: '/', label: 'Overview' },
    { path: '/verify', label: 'Prove & Verify' },
    { path: '/requests', label: 'Landlord Requests' },
    { path: '/issue', label: 'Issue Credential' },
    { path: '/admin', label: 'Contract Deploy' },
  ];

  const formatAddress = (addr: string) => {
    if (!addr) return '';
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <header className="sticky top-0 z-50 bg-[#080c14]/90 backdrop-blur-md border-b border-slate-800/80">
      <div className="container-custom flex items-center justify-between h-16">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2.5 text-white font-bold tracking-tight text-lg group">
          <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500/20 transition-colors">
            <Shield size={20} className="stroke-[2.2]" />
          </div>
          <div className="flex flex-col">
            <span className="text-white leading-none">ProofRent</span>
            <span className="text-[10px] font-mono text-emerald-400/80 tracking-wider">MIDNIGHT NETWORK</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-900/50 p-1 rounded-lg border border-slate-800">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-slate-800 text-white font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Wallet & Network info */}
        <div className="flex items-center gap-2.5">
          {/* Preprod Network Pill */}
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Preprod</span>
          </div>

          {/* Wallet Button */}
          {isConnected && address ? (
            <div className="relative">
              <button
                onClick={() => setWalletDropdownOpen(!walletDropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700/80 hover:border-slate-600 text-xs font-mono text-white transition-colors"
              >
                <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                <span>{formatAddress(address)}</span>
                <span className="text-slate-500 text-[10px] uppercase font-bold px-1 py-0.5 rounded bg-slate-800">
                  {walletType ?? '1AM'}
                </span>
                <ChevronDown size={14} className="text-slate-400" />
              </button>

              {walletDropdownOpen && (
                <div className="absolute right-0 mt-2 w-72 rounded-xl bg-slate-900 border border-slate-800 shadow-2xl p-4 text-xs z-50">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
                    <span className="text-slate-400 font-medium">Connected Wallet</span>
                    <span className="badge-verified text-[11px] py-0.5 px-2">Active</span>
                  </div>

                  <div className="mb-3">
                    <div className="text-[11px] text-slate-400 mb-1">Unshielded Address</div>
                    <div className="font-mono text-[11px] bg-slate-950 p-2 rounded-md break-all border border-slate-800 text-slate-200 select-all">
                      {address}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                    <a
                      href={`${NETWORK_CONFIGS.preprod.faucet}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1 text-[11px]"
                    >
                      <span>Get Preprod DUST</span>
                      <ExternalLink size={12} />
                    </a>

                    <button
                      onClick={() => {
                        disconnect();
                        setWalletDropdownOpen(false);
                      }}
                      className="text-red-400 hover:text-red-300 text-[11px]"
                    >
                      Disconnect
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => connect('preprod')}
              disabled={isConnecting}
              className="btn-primary py-1.5 px-3.5 text-xs font-semibold"
            >
              {isConnecting ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
                  <span>Connecting...</span>
                </>
              ) : (
                <>
                  <Key size={14} />
                  <span>Connect Wallet</span>
                </>
              )}
            </button>
          )}

          {/* Mobile menu trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-[#080c14] px-4 py-3 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2 rounded-md text-sm font-medium ${
                location.pathname === link.path
                  ? 'bg-slate-800 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}

      {/* Connection error banner if any */}
      {connectionError && (
        <div className="bg-amber-950/80 border-b border-amber-800 text-amber-200 px-4 py-2 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle size={15} className="text-amber-400 shrink-0" />
            <span>{connectionError}</span>
          </div>
          <button
            onClick={() => connect('preprod')}
            className="underline hover:text-white shrink-0 ml-4 font-semibold"
          >
            Retry
          </button>
        </div>
      )}
    </header>
  );
}
