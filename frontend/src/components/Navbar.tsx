import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useWallet } from '../contexts/WalletContext';
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
    { path: '/requests', label: 'Requests' },
    { path: '/issue', label: 'Issue Credential' },
    { path: '/admin', label: 'Deploy' },
  ];

  const formatAddress = (addr: string) => (addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : '');

  return (
    <header className="pr-nav">
      <div className="container-custom pr-nav-inner">
        <Link to="/" className="pr-brand" onClick={() => setMobileMenuOpen(false)}>
          <img src="/proofrent-orb.svg" alt="ProofRent orbital key" width="38" height="38" />
          <span className="pr-brand-copy">
            <span className="pr-brand-name">ProofRent</span>
            <span className="pr-brand-sub">private rental protocol</span>
          </span>
        </Link>

        <nav className="pr-nav-links" aria-label="Primary navigation">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path || (link.path === '/' && location.pathname === '/overview');
            return (
              <Link key={link.path} to={link.path} className={`pr-nav-link ${isActive ? 'active' : ''}`} aria-current={isActive ? 'page' : undefined}>
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="pr-nav-actions">
          <div className="pr-network" title="Midnight Preprod network">
            <span className="pr-network-dot" />
            <span>PREPROD / LIVE</span>
          </div>

          {isConnected && address ? (
            <div className="relative">
              <button
                onClick={() => setWalletDropdownOpen((open) => !open)}
                className="pr-wallet-btn"
                aria-expanded={walletDropdownOpen}
              >
                <span className="pr-network-dot" />
                <span>{formatAddress(address)}</span>
                <span style={{ color: '#8d899b' }}>{walletType ?? 'wallet'}</span>
                <span aria-hidden="true">⌄</span>
              </button>
              {walletDropdownOpen && (
                <div className="pr-wallet-menu">
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#f2eefc', fontSize: '.76rem', fontWeight: 700 }}>
                    <span>Connected vault</span>
                    <span className="badge-verified" style={{ fontSize: '.56rem' }}>active</span>
                  </div>
                  <div className="pr-wallet-address">{address}</div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginTop: 14, fontSize: '.66rem' }}>
                    <a href={NETWORK_CONFIGS.preprod.faucet} target="_blank" rel="noopener noreferrer" style={{ color: '#8de0d8' }}>
                      Get test DUST ↗
                    </a>
                    <button
                      onClick={() => { disconnect(); setWalletDropdownOpen(false); }}
                      style={{ border: 0, padding: 0, color: '#ff9eb6', background: 'none', cursor: 'pointer', fontSize: '.66rem' }}
                    >
                      Disconnect
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button onClick={() => connect('preprod')} disabled={isConnecting} className="btn-primary" style={{ padding: '.62rem .95rem', fontSize: '.7rem' }}>
              {isConnecting ? 'syncing…' : 'Connect vault'}
            </button>
          )}

          <button
            className="pr-mobile-trigger"
            onClick={() => setMobileMenuOpen((open) => !open)}
            aria-label={mobileMenuOpen ? 'Close navigation' : 'Open navigation'}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation"
          >
            {mobileMenuOpen ? '×' : '≡'}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <nav id="mobile-navigation" className="pr-mobile-menu" aria-label="Mobile navigation">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path || (link.path === '/' && location.pathname === '/overview');
            return (
              <Link key={link.path} to={link.path} onClick={() => setMobileMenuOpen(false)} className={isActive ? 'active' : ''} aria-current={isActive ? 'page' : undefined}>
                {link.label}
              </Link>
            );
          })}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingTop: 14, color: walletStatus === 'detected' ? '#8de0d8' : '#777486', fontFamily: 'var(--font-mono)', fontSize: '.58rem' }}>
            <span className="pr-network-dot" />
            {walletStatus === 'detected' ? 'wallet extension detected' : 'privacy-first / midnight preprod'}
          </div>
        </nav>
      )}

      {connectionError && (
        <div className="pr-connection-error" role="alert">
          <span>Vault connection paused — {connectionError}</span>
          <button onClick={() => connect('preprod')} style={{ border: 0, color: '#f4d998', background: 'none', textDecoration: 'underline', cursor: 'pointer', fontSize: '.7rem' }}>
            retry
          </button>
        </div>
      )}
    </header>
  );
}
