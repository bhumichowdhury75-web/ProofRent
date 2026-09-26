import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useWallet } from '../contexts/WalletContext';
import { SelectiveDisclosureDiagram } from '../components/SelectiveDisclosureDiagram';
import {
  Shield,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle2,
  FileText,
  Key,
  Database,
  Layers,
  ChevronDown,
  HelpCircle,
  Sparkles,
} from 'lucide-react';

export function LandingPage() {
  const { isConnected, connect } = useWallet();
  const [sliderMonths, setSliderMonths] = useState(18);
  const [sliderScore, setSliderScore] = useState(98);
  const [violations, setViolations] = useState(0);

  const reqMonths = 12;
  const reqScore = 90;
  const isEligible = sliderMonths >= reqMonths && sliderScore >= reqScore && violations === 0;

  const faqs = [
    {
      q: 'Does ProofRent store my lease or rent documents on a blockchain?',
      a: 'No. Midnight is a privacy-first data protection blockchain. Your sensitive rental documents, physical addresses, and exact rent amounts remain strictly on your local device as private witnesses. Only zero-knowledge proofs and anonymous anti-replay nullifiers are verified on-chain.',
    },
    {
      q: 'How does a new landlord know my credential is genuine?',
      a: 'When your previous landlord issues your credential, they register a cryptographic commitment (hash) on the Midnight ledger. When you prove your history, the zero-knowledge circuit mathematically confirms that your private credential matches this on-chain commitment without revealing the preimage data.',
    },
    {
      q: 'Can a tenant reuse the same credential to apply for multiple apartments?',
      a: 'Yes, but Midnight nullifiers ensure replay protection within each specific verification request scope, preventing identity duplication while protecting your anonymity across different landlords.',
    },
    {
      q: 'What network does ProofRent run on?',
      a: 'ProofRent runs on the Midnight Preprod Testnet, using Compact smart contracts and the Midnight TypeScript SDK.',
    },
  ];

  return (
    <div className="space-y-24 py-8">
      {/* Hero Section */}
      <section className="container-custom pt-8 pb-4 text-center max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono mb-6">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>Zero-Knowledge Rental Credentials on Midnight Network</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-[1.1] mb-6">
          Prove your rental history. <br />
          <span className="text-emerald-400">Keep your history private.</span>
        </h1>

        <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto mb-8 leading-relaxed font-normal">
          ProofRent lets tenants prove verified rental history without exposing the private details behind it.
          No leaked addresses, no exposed rent amounts, no surrendered lease contracts.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5">
          <Link to="/verify" className="btn-primary w-full sm:w-auto text-sm py-3 px-6 shadow-lg shadow-emerald-500/10">
            <span>Get Started</span>
            <ArrowRight size={16} />
          </Link>
          <a href="#how-it-works" className="btn-secondary w-full sm:w-auto text-sm py-3 px-6">
            <span>See How It Works</span>
          </a>
        </div>
      </section>

      {/* Problem & Solution Comparison */}
      <section className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* The Problem */}
          <div className="editorial-card p-6 sm:p-8 bg-slate-900/40 border-slate-800">
            <div className="flex items-center gap-2 text-red-400 font-semibold text-xs tracking-wider uppercase mb-3">
              <EyeOff size={15} />
              <span>The Problem With Traditional Rental Screening</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-3">
              Excessive Disclosure & Centralized Risk
            </h3>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed mb-4">
              When tenants apply for a new home, landlords demand proof of responsible tenure.
              Traditional verification forces applicants to surrender intimate personal data:
            </p>
            <ul className="space-y-2 text-xs text-slate-300">
              <li className="flex items-center gap-2">
                <span className="text-red-400 font-bold">&times;</span>
                <span>Exposes previous home addresses and personal living history</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-red-400 font-bold">&times;</span>
                <span>Reveals exact past rent payments, weakening lease negotiations</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-red-400 font-bold">&times;</span>
                <span>Requires sharing sensitive bank statements and full lease PDFs</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-red-400 font-bold">&times;</span>
                <span>Leaves unencrypted personal data stored on vulnerable property management servers</span>
              </li>
            </ul>
          </div>

          {/* The ProofRent Solution */}
          <div className="editorial-card p-6 sm:p-8 bg-emerald-950/10 border-emerald-500/30">
            <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs tracking-wider uppercase mb-3">
              <Shield size={15} />
              <span>The ProofRent Solution</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-3">
              Zero-Knowledge Selective Disclosure
            </h3>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-4">
              ProofRent empowers tenants with verifiable credentials issued by previous landlords.
              You prove only the specific claims the prospective landlord actually needs:
            </p>
            <ul className="space-y-2 text-xs text-slate-200">
              <li className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                <span>Prove: "Tenancy duration lasted at least 12 months" without revealing the exact dates</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                <span>Prove: "Payment reliability score &gt;= 95%" without exposing bank statements</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                <span>Prove: "Zero unresolved lease infractions" and "Lease completed in good standing"</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                <span>Verified cryptographically on Midnight without exposing your identity on-chain</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Interactive Selective Disclosure Simulator */}
      <section id="how-it-works" className="container-custom">
        <div className="editorial-card p-6 sm:p-10 border-slate-700 bg-[#0d1424]">
          <div className="text-center max-w-xl mx-auto mb-8">
            <div className="badge-verified mb-2">Interactive Demonstration</div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Test Selective Disclosure In Action
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm mt-1">
              Adjust your private rental history witness values below. Notice how the prospective landlord only learns whether their policy is satisfied.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Private Tenant Controls (Witness Inputs) */}
            <div className="lg:col-span-6 bg-slate-900/90 p-6 rounded-xl border border-slate-800 space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2 text-slate-200 font-semibold text-xs uppercase tracking-wide">
                  <Lock size={14} className="text-emerald-400" />
                  <span>Your Private Witness Data (Stays on Device)</span>
                </div>
                <span className="badge-private text-[10px]">Confidential</span>
              </div>

              {/* Tenancy duration slider */}
              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-slate-300">Previous Tenancy Duration:</span>
                  <span className="font-mono text-emerald-400 font-bold">{sliderMonths} months</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="48"
                  value={sliderMonths}
                  onChange={(e) => setSliderMonths(Number(e.target.value))}
                  className="w-full accent-emerald-500 bg-slate-800 rounded-lg cursor-pointer h-2"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
                  <span>1 mo</span>
                  <span>12 mo requirement</span>
                  <span>48 mo</span>
                </div>
              </div>

              {/* Payment score slider */}
              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-slate-300">On-Time Payment Reliability:</span>
                  <span className="font-mono text-emerald-400 font-bold">{sliderScore}%</span>
                </div>
                <input
                  type="range"
                  min="60"
                  max="100"
                  value={sliderScore}
                  onChange={(e) => setSliderScore(Number(e.target.value))}
                  className="w-full accent-emerald-500 bg-slate-800 rounded-lg cursor-pointer h-2"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
                  <span>60%</span>
                  <span>90% requirement</span>
                  <span>100%</span>
                </div>
              </div>

              {/* Infractions toggle */}
              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-slate-300">Unresolved Lease Infractions:</span>
                  <span className={`font-mono font-bold ${violations === 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {violations} violations
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {[0, 1, 2].map((v) => (
                    <button
                      key={v}
                      onClick={() => setViolations(v)}
                      className={`py-1.5 px-3 rounded-md text-xs font-mono border transition-colors ${
                        violations === v
                          ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                          : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:text-white'
                      }`}
                    >
                      {v} {v === 1 ? 'Violation' : 'Violations'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Hidden details */}
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800/80 text-[11px] font-mono text-slate-500 space-y-1">
                <div>Street Address: [HIDDEN FROM VERIFIER]</div>
                <div>Exact Monthly Rent: [HIDDEN FROM VERIFIER]</div>
                <div>Previous Landlord Phone: [HIDDEN FROM VERIFIER]</div>
              </div>
            </div>

            {/* What the Verifier Learns */}
            <div className="lg:col-span-6 bg-slate-900/90 p-6 rounded-xl border border-slate-800 space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2 text-slate-200 font-semibold text-xs uppercase tracking-wide">
                  <Eye size={14} className="text-emerald-400" />
                  <span>Verifier Readout (What Landlord Sees)</span>
                </div>
                <span className={isEligible ? 'badge-verified text-[10px]' : 'badge-pending text-[10px] text-red-400 border-red-500/30 bg-red-950/20'}>
                  {isEligible ? 'VERIFIED' : 'NOT SATISFIED'}
                </span>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-slate-300">Duration &gt;= 12 Months:</span>
                  <span className={sliderMonths >= reqMonths ? 'text-emerald-400 font-bold' : 'text-red-400 font-bold'}>
                    {sliderMonths >= reqMonths ? '✓ SATISFIED' : '✗ FAILED'}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-slate-300">Payment Reliability &gt;= 90%:</span>
                  <span className={sliderScore >= reqScore ? 'text-emerald-400 font-bold' : 'text-red-400 font-bold'}>
                    {sliderScore >= reqScore ? '✓ SATISFIED' : '✗ FAILED'}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-slate-300">Unresolved Infractions &lt;= 0:</span>
                  <span className={violations === 0 ? 'text-emerald-400 font-bold' : 'text-red-400 font-bold'}>
                    {violations === 0 ? '✓ SATISFIED' : '✗ FAILED'}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-slate-300">Lease Completed in Good Standing:</span>
                  <span className="text-emerald-400 font-bold">✓ SATISFIED</span>
                </div>
              </div>

              <div className="pt-2">
                <div className="text-[11px] text-slate-400 leading-relaxed bg-emerald-950/20 p-3 rounded-lg border border-emerald-500/20">
                  <strong className="text-emerald-400">Zero-Knowledge Result: </strong>
                  The verifier learns with mathematical certainty whether the criteria were met.
                  They do NOT learn that you rented for {sliderMonths} months or paid {sliderScore}%.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Visual Pipeline Section */}
      <section className="container-custom">
        <SelectiveDisclosureDiagram />
      </section>

      {/* FAQ Section */}
      <section className="container-custom max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <div className="badge-private mb-2">Frequently Asked Questions</div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Understanding ProofRent</h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="editorial-card p-5 bg-slate-900/60 border-slate-800">
              <h4 className="font-semibold text-white text-sm mb-2 flex items-start gap-2">
                <HelpCircle size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                <span>{faq.q}</span>
              </h4>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed pl-6">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
