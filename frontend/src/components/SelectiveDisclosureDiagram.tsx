import { Shield, Lock, Eye, EyeOff, ArrowDown, Check, X } from 'lucide-react';

export function SelectiveDisclosureDiagram() {
  return (
    <div className="editorial-card p-6 sm:p-8">
      <div className="text-center max-w-xl mx-auto mb-8">
        <div className="badge-private mb-2.5">Cryptographic Pipeline</div>
        <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
          How Midnight Protects Your Rental Privacy
        </h3>
        <p className="text-slate-400 text-xs sm:text-sm mt-1.5">
          Zero-Knowledge proofs allow tenants to prove qualification without disclosing sensitive records.
        </p>
      </div>

      {/* Visual Flow diagram: Landlord -> Private Credential -> Tenant -> ZK Proof -> New Landlord */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-center text-center mb-10">
        {/* Step 1 */}
        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl flex flex-col items-center">
          <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 mb-2 font-mono text-xs font-bold">
            01
          </div>
          <div className="text-white font-semibold text-xs mb-1">Previous Landlord</div>
          <div className="text-slate-400 text-[11px] leading-tight">
            Issues signed credential to tenant & registers commitment
          </div>
        </div>

        {/* Arrow */}
        <div className="flex justify-center text-slate-600">
          <ArrowDown className="md:-rotate-90 text-emerald-500" size={20} />
        </div>

        {/* Step 2 */}
        <div className="bg-emerald-950/20 border border-emerald-500/30 p-4 rounded-xl flex flex-col items-center">
          <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-2 font-mono text-xs font-bold">
            02
          </div>
          <div className="text-white font-semibold text-xs mb-1">Tenant Private Vault</div>
          <div className="text-slate-300 text-[11px] leading-tight">
            Stores private lease details locally in browser memory
          </div>
        </div>

        {/* Arrow */}
        <div className="flex justify-center text-slate-600">
          <ArrowDown className="md:-rotate-90 text-emerald-500" size={20} />
        </div>

        {/* Step 3 */}
        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl flex flex-col items-center">
          <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 mb-2 font-mono text-xs font-bold">
            03
          </div>
          <div className="text-white font-semibold text-xs mb-1">New Landlord</div>
          <div className="text-slate-400 text-[11px] leading-tight">
            Receives verified mathematical proof: YES / NO only
          </div>
        </div>
      </div>

      {/* Selective Disclosure Breakdown Table */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* What verifier learns */}
        <div className="bg-emerald-950/15 border border-emerald-500/25 rounded-xl p-5">
          <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm mb-3">
            <Eye size={16} />
            <span>What The New Landlord Learns</span>
          </div>
          <ul className="space-y-2.5 text-xs">
            <li className="flex items-start gap-2 text-slate-200">
              <span className="p-0.5 rounded bg-emerald-500/20 text-emerald-400 mt-0.5">
                <Check size={12} className="stroke-[3]" />
              </span>
              <span>
                <strong>Lease duration requirement satisfied:</strong> Tenancy met minimum threshold (e.g. 12+ months)
              </span>
            </li>
            <li className="flex items-start gap-2 text-slate-200">
              <span className="p-0.5 rounded bg-emerald-500/20 text-emerald-400 mt-0.5">
                <Check size={12} className="stroke-[3]" />
              </span>
              <span>
                <strong>Payment reliability verified:</strong> On-time rent payment percentage satisfies policy
              </span>
            </li>
            <li className="flex items-start gap-2 text-slate-200">
              <span className="p-0.5 rounded bg-emerald-500/20 text-emerald-400 mt-0.5">
                <Check size={12} className="stroke-[3]" />
              </span>
              <span>
                <strong>No unresolved violations:</strong> Lease completed in good standing without infractions
              </span>
            </li>
            <li className="flex items-start gap-2 text-slate-200">
              <span className="p-0.5 rounded bg-emerald-500/20 text-emerald-400 mt-0.5">
                <Check size={12} className="stroke-[3]" />
              </span>
              <span>
                <strong>Cryptographic validity:</strong> Issued by authorized landlord and unrevoked
              </span>
            </li>
          </ul>
        </div>

        {/* What stays completely private */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center gap-2 text-slate-300 font-semibold text-sm mb-3">
            <EyeOff size={16} className="text-amber-400" />
            <span>What Stays 100% Private (Never Disclosed)</span>
          </div>
          <ul className="space-y-2.5 text-xs">
            <li className="flex items-start gap-2 text-slate-400">
              <span className="p-0.5 rounded bg-slate-800 text-slate-400 mt-0.5">
                <X size={12} className="stroke-[3]" />
              </span>
              <span>
                <strong className="text-slate-300">Previous physical address:</strong> Apartment number, street, and location remain shielded
              </span>
            </li>
            <li className="flex items-start gap-2 text-slate-400">
              <span className="p-0.5 rounded bg-slate-800 text-slate-400 mt-0.5">
                <X size={12} className="stroke-[3]" />
              </span>
              <span>
                <strong className="text-slate-300">Exact monthly rent:</strong> Landlord never sees how much you previously paid
              </span>
            </li>
            <li className="flex items-start gap-2 text-slate-400">
              <span className="p-0.5 rounded bg-slate-800 text-slate-400 mt-0.5">
                <X size={12} className="stroke-[3]" />
              </span>
              <span>
                <strong className="text-slate-300">Previous landlord identity:</strong> Personal contact info is never exposed
              </span>
            </li>
            <li className="flex items-start gap-2 text-slate-400">
              <span className="p-0.5 rounded bg-slate-800 text-slate-400 mt-0.5">
                <X size={12} className="stroke-[3]" />
              </span>
              <span>
                <strong className="text-slate-300">Full lease document:</strong> Private terms and signatures stay on your device
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
