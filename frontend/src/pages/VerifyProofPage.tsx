import { useState } from 'react';
import { useWallet } from '../contexts/WalletContext';
import { useRentalData, type RentalCredentialRecord, type VerificationRequest } from '../contexts/RentalDataContext';
import { ProofModal } from '../components/ProofModal';
import {
  Shield,
  Key,
  CheckCircle,
  FileCheck,
  ChevronRight,
  ArrowRight,
  Eye,
  EyeOff,
  Check,
  X,
  Sliders,
  AlertCircle,
} from 'lucide-react';

export function VerifyProofPage() {
  const { isConnected, connect } = useWallet();
  const { credentials, requests } = useRentalData();

  const [selectedRequestId, setSelectedRequestId] = useState<string>(requests[0]?.id ?? '');
  const [selectedCredId, setSelectedCredId] = useState<string>(credentials[0]?.id ?? '');
  const [proofModalOpen, setProofModalOpen] = useState(false);

  // Custom criteria toggle if user wants to prove standalone criteria
  const [useCustomCriteria, setUseCustomCriteria] = useState(false);
  const [customMonths, setCustomMonths] = useState(12);
  const [customScore, setCustomScore] = useState(90);
  const [customViolations, setCustomViolations] = useState(0);

  const selectedRequest = requests.find((r) => r.id === selectedRequestId);
  const selectedCredential = credentials.find((c) => c.id === selectedCredId) ?? credentials[0];

  const minMonths = useCustomCriteria ? customMonths : (selectedRequest?.minMonthsRequired ?? 12);
  const minScore = useCustomCriteria ? customScore : (selectedRequest?.minPaymentScoreRequired ?? 90);
  const maxViolations = useCustomCriteria ? customViolations : (selectedRequest?.maxViolationsAllowed ?? 0);

  const passesMonths = selectedCredential ? selectedCredential.tenancyMonths >= minMonths : false;
  const passesScore = selectedCredential ? selectedCredential.paymentScore >= minScore : false;
  const passesViolations = selectedCredential ? selectedCredential.violations <= maxViolations : false;
  const passesLease = selectedCredential ? selectedCredential.leaseCompleted : false;

  const isEligible = passesMonths && passesScore && passesViolations && passesLease;

  return (
    <div className="container-custom py-8 max-w-4xl space-y-8">
      {/* Title */}
      <div>
        <div className="badge-verified mb-2">Zero-Knowledge Verification</div>
        <h2 className="text-3xl font-extrabold text-white tracking-tight">Prove Your Rental History</h2>
        <p className="text-slate-400 text-sm mt-1">
          Generate an authentic cryptographic zero-knowledge proof for prospective landlords.
        </p>
      </div>

      {/* Step by Step Container */}
      <div className="space-y-6">
        {/* Step 1: Select Verification Request or Custom Policy */}
        <div className="editorial-card p-6 bg-slate-900/80 border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-mono text-xs font-bold">
                1
              </span>
              <h3 className="text-sm font-bold text-white">Select Verification Request</h3>
            </div>
            <button
              onClick={() => setUseCustomCriteria(!useCustomCriteria)}
              className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-medium"
            >
              <Sliders size={13} />
              <span>{useCustomCriteria ? 'Choose From Requests' : 'Specify Custom Policy'}</span>
            </button>
          </div>

          {!useCustomCriteria ? (
            <div className="space-y-2.5">
              {requests.map((req) => (
                <label
                  key={req.id}
                  className={`flex items-start gap-3 p-3.5 rounded-lg border cursor-pointer transition-all ${
                    selectedRequestId === req.id
                      ? 'bg-slate-800/90 border-emerald-500/50 shadow-md'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <input
                    type="radio"
                    name="request_select"
                    checked={selectedRequestId === req.id}
                    onChange={() => setSelectedRequestId(req.id)}
                    className="mt-1 accent-emerald-500"
                  />
                  <div className="flex-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-white text-sm">{req.propertyTitle} — {req.propertyUnit}</span>
                      <span className="badge-pending text-[10px]">{req.status}</span>
                    </div>
                    <div className="text-slate-400 mt-0.5">Verifier: {req.verifierName}</div>
                    <div className="text-[11px] font-mono text-emerald-400/90 mt-1">
                      Requirements: Duration &gt;= {req.minMonthsRequired} mo &bull; On-Time Score &gt;= {req.minPaymentScoreRequired}% &bull; Infractions &lt;= {req.maxViolationsAllowed}
                    </div>
                  </div>
                </label>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
              <div>
                <label className="block text-slate-300 text-xs mb-1 font-medium">Minimum Tenancy Duration</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="1"
                    max="60"
                    value={customMonths}
                    onChange={(e) => setCustomMonths(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs font-mono text-white"
                  />
                  <span className="text-xs text-slate-400">Months</span>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 text-xs mb-1 font-medium">Min On-Time Payment Score</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="50"
                    max="100"
                    value={customScore}
                    onChange={(e) => setCustomScore(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs font-mono text-white"
                  />
                  <span className="text-xs text-slate-400">%</span>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 text-xs mb-1 font-medium">Max Allowable Infractions</label>
                <input
                  type="number"
                  min="0"
                  max="5"
                  value={customViolations}
                  onChange={(e) => setCustomViolations(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs font-mono text-white"
                />
              </div>
            </div>
          )}
        </div>

        {/* Step 2: Choose Credential From Vault */}
        <div className="editorial-card p-6 bg-slate-900/80 border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-mono text-xs font-bold">
                2
              </span>
              <h3 className="text-sm font-bold text-white">Select Credential Witness</h3>
            </div>
            <span className="text-xs text-slate-400 font-mono">{credentials.length} available in vault</span>
          </div>

          <div className="space-y-2.5">
            {credentials.map((cred) => (
              <label
                key={cred.id}
                className={`flex items-start gap-3 p-3.5 rounded-lg border cursor-pointer transition-all ${
                  selectedCredId === cred.id
                    ? 'bg-slate-800/90 border-emerald-500/50 shadow-md'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <input
                  type="radio"
                  name="cred_select"
                  checked={selectedCredId === cred.id}
                  onChange={() => setSelectedCredId(cred.id)}
                  className="mt-1 accent-emerald-500"
                />
                <div className="flex-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-white">{cred.propertyLabel}</span>
                    <span className="badge-verified text-[10px]">{cred.status}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 mt-2 font-mono text-[11px] text-slate-300">
                    <div>Duration: <strong className="text-emerald-400">{cred.tenancyMonths} mo</strong></div>
                    <div>Payment: <strong className="text-emerald-400">{cred.paymentScore}%</strong></div>
                    <div>Violations: <strong className="text-emerald-400">{cred.violations}</strong></div>
                  </div>
                  <div className="text-[10px] font-mono text-slate-500 mt-1 truncate">
                    Commitment: {cred.commitment}
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Step 3: Selective Disclosure Breakdown */}
        <div className="editorial-card p-6 bg-slate-900/50 border-slate-800 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
            <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-mono text-xs font-bold">
              3
            </span>
            <h3 className="text-sm font-bold text-white">Selective Disclosure Review</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-emerald-950/15 border border-emerald-500/20 text-xs">
              <div className="flex items-center gap-1.5 text-emerald-400 font-semibold mb-2 text-xs">
                <Eye size={14} />
                <span>New Landlord Will Learn:</span>
              </div>
              <ul className="space-y-1.5 text-slate-200 text-xs">
                <li className="flex items-center gap-2">
                  <Check size={13} className="text-emerald-400 shrink-0" />
                  <span>Tenancy duration &gt;= {minMonths} months</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check size={13} className="text-emerald-400 shrink-0" />
                  <span>Rent payment reliability &gt;= {minScore}%</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check size={13} className="text-emerald-400 shrink-0" />
                  <span>Lease completed with no unresolved violations</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check size={13} className="text-emerald-400 shrink-0" />
                  <span>Issuer cryptographic commitment authenticity</span>
                </li>
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs">
              <div className="flex items-center gap-1.5 text-amber-400 font-semibold mb-2 text-xs">
                <EyeOff size={14} />
                <span>They Will NOT Learn:</span>
              </div>
              <ul className="space-y-1.5 text-slate-400 text-xs">
                <li className="flex items-center gap-2">
                  <X size={13} className="text-slate-500 shrink-0" />
                  <span>Previous physical street address</span>
                </li>
                <li className="flex items-center gap-2">
                  <X size={13} className="text-slate-500 shrink-0" />
                  <span>Exact rent paid ($/month)</span>
                </li>
                <li className="flex items-center gap-2">
                  <X size={13} className="text-slate-500 shrink-0" />
                  <span>Previous landlord contact details</span>
                </li>
                <li className="flex items-center gap-2">
                  <X size={13} className="text-slate-500 shrink-0" />
                  <span>Full lease agreement documents</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs">
              <span className="text-slate-400">Pre-Evaluation Status: </span>
              {isEligible ? (
                <span className="font-semibold text-emerald-400">Policy Criteria Fully Satisfied</span>
              ) : (
                <span className="font-semibold text-red-400">Selected Credential Fails Criteria</span>
              )}
            </div>

            <button
              onClick={() => setProofModalOpen(true)}
              disabled={!selectedCredential}
              className="btn-primary w-full sm:w-auto text-xs py-2.5 px-6 font-semibold"
            >
              <Shield size={14} />
              <span>Synthesize Proof on Midnight</span>
            </button>
          </div>
        </div>
      </div>

      {/* Proof Modal */}
      {selectedCredential && (
        <ProofModal
          isOpen={proofModalOpen}
          onClose={() => setProofModalOpen(false)}
          request={useCustomCriteria ? null : selectedRequest}
          credential={selectedCredential}
        />
      )}
    </div>
  );
}
