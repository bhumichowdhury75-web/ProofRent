import { Shield, Lock, ExternalLink } from 'lucide-react';
import { NETWORK_CONFIGS } from '../config';

export function Footer() {
  return (
    <footer className="border-t border-slate-800/80 bg-[#060a10] text-slate-400 py-12 mt-20 text-xs">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand info */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 text-white font-bold text-base mb-3">
              <div className="w-7 h-7 rounded-md bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Shield size={16} />
              </div>
              <span>ProofRent</span>
            </div>
            <p className="text-slate-300 font-medium mb-3 max-w-md">
              "Prove your rental history. Keep your history private."
            </p>
            <p className="text-slate-400 text-xs leading-relaxed max-w-md">
              ProofRent is a privacy-first rental verification platform built on the Midnight Network.
              Tenants prove verified rental reliability, lease completion, and good standing to new landlords
              using zero-knowledge proofs without exposing previous addresses, exact rent amounts, or complete lease contracts.
            </p>
          </div>

          {/* Privacy Architecture */}
          <div>
            <div className="text-slate-200 font-semibold mb-3 tracking-wide uppercase text-[11px]">
              Privacy Principles
            </div>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-slate-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span>Zero-Knowledge Proofs</span>
              </li>
              <li className="flex items-center gap-2 text-slate-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span>Selective Disclosure</span>
              </li>
              <li className="flex items-center gap-2 text-slate-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span>Cryptographic Commitments</span>
              </li>
              <li className="flex items-center gap-2 text-slate-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span>Nullifiers for Replay Protection</span>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <div className="text-slate-200 font-semibold mb-3 tracking-wide uppercase text-[11px]">
              Network Resources
            </div>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://docs.midnight.network"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-400 flex items-center gap-1 transition-colors"
                >
                  <span>Midnight Network Docs</span>
                  <ExternalLink size={12} />
                </a>
              </li>
              <li>
                <a
                  href={NETWORK_CONFIGS.preprod.faucet}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-400 flex items-center gap-1 transition-colors"
                >
                  <span>Preprod DUST Faucet</span>
                  <ExternalLink size={12} />
                </a>
              </li>
              <li>
                <a
                  href={NETWORK_CONFIGS.preprod.explorer}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-400 flex items-center gap-1 transition-colors"
                >
                  <span>Preprod Explorer</span>
                  <ExternalLink size={12} />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-400">
          <div className="flex items-center gap-2">
            <Lock size={14} className="text-emerald-400" />
            <span>Built with Compact Smart Contracts on Midnight Preprod</span>
          </div>
          <div>
            ProofRent &bull; Midnight Network &bull; Level 4 Production-Grade Architecture
          </div>
        </div>
      </div>
    </footer>
  );
}
