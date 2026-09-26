import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useRentalData, type VerificationRequest } from '../contexts/RentalDataContext';
import { getProofHistory, type VerificationHistoryItem } from '../lib/proofHistory';
import {
  Shield,
  Plus,
  CheckCircle,
  Clock,
  Eye,
  EyeOff,
  Building,
  UserCheck,
  Check,
  X,
  FileCheck,
  ExternalLink,
} from 'lucide-react';

export function RequestsPage() {
  const { requests, createRequest } = useRentalData();
  const history = getProofHistory();

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [propertyTitle, setPropertyTitle] = useState('');
  const [propertyUnit, setPropertyUnit] = useState('');
  const [verifierName, setVerifierName] = useState('');
  const [minMonths, setMinMonths] = useState(12);
  const [minScore, setMinScore] = useState(90);
  const [maxViolations, setMaxViolations] = useState(0);
  const [notes, setNotes] = useState('');

  const [selectedProof, setSelectedProof] = useState<VerificationHistoryItem | null>(null);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!propertyTitle || !propertyUnit || !verifierName) return;

    createRequest({
      propertyTitle,
      propertyUnit,
      verifierName,
      minMonthsRequired: minMonths,
      minPaymentScoreRequired: minScore,
      maxViolationsAllowed: maxViolations,
      minCompletedLeasesRequired: 1,
      notes,
    });

    setPropertyTitle('');
    setPropertyUnit('');
    setVerifierName('');
    setNotes('');
    setCreateModalOpen(false);
  };

  return (
    <div className="container-custom py-8 max-w-5xl space-y-8">
      {/* Title & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="badge-verified mb-2">New Landlord / Verifier Portal</div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">Verification Requests</h2>
          <p className="text-slate-400 text-sm mt-1">
            Specify minimum rental screening criteria. Receive verified zero-knowledge proofs without invading tenant privacy.
          </p>
        </div>

        <button
          onClick={() => setCreateModalOpen(true)}
          className="btn-primary text-xs py-2.5 px-4 font-semibold flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus size={15} />
          <span>Create Verification Request</span>
        </button>
      </div>

      {/* Active Requests List */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-white">Active Property Screening Requests ({requests.length})</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {requests.map((req) => (
            <div
              key={req.id}
              className="editorial-card p-5 bg-slate-900/80 border-slate-800 space-y-4 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <h4 className="font-bold text-white text-sm">{req.propertyTitle}</h4>
                    <div className="text-slate-400 text-xs">Unit: {req.propertyUnit}</div>
                  </div>
                  <span
                    className={
                      req.status === 'verified'
                        ? 'badge-verified text-[10px]'
                        : 'badge-pending text-[10px]'
                    }
                  >
                    {req.status === 'verified' ? 'Proof Verified' : 'Awaiting Proof'}
                  </span>
                </div>

                <div className="text-xs text-slate-400 mb-3">
                  Verifier / Management: <strong className="text-slate-200">{req.verifierName}</strong>
                </div>

                {/* Required criteria tags */}
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800/80 text-xs space-y-1.5">
                  <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">
                    Mandatory Policy Criteria
                  </div>
                  <div className="grid grid-cols-3 gap-2 font-mono text-[11px]">
                    <div>
                      <span className="text-slate-500 block text-[10px]">Min Tenancy:</span>
                      <strong className="text-emerald-400">&gt;= {req.minMonthsRequired} mo</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">Payment Score:</span>
                      <strong className="text-emerald-400">&gt;= {req.minPaymentScoreRequired}%</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">Infractions:</span>
                      <strong className="text-slate-200">&lt;= {req.maxViolationsAllowed}</strong>
                    </div>
                  </div>
                </div>

                {req.notes && (
                  <p className="text-[11px] text-slate-400 mt-3 italic">
                    "{req.notes}"
                  </p>
                )}
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-500 text-[11px]">
                  Created {new Date(req.createdAt).toLocaleDateString()}
                </span>
                {req.status === 'verified' ? (
                  <span className="text-emerald-400 font-semibold flex items-center gap-1 text-xs">
                    <CheckCircle size={13} />
                    <span>Satisfied by Applicant</span>
                  </span>
                ) : (
                  <Link
                    to="/verify"
                    className="text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1 text-xs"
                  >
                    <span>Fulfill as Applicant</span>
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Verified Receipts Readout for Verifier */}
      <div className="editorial-card p-6 bg-slate-900/60 border-slate-800 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <FileCheck size={18} className="text-emerald-400" />
              <span>Verified Applicant Proofs</span>
            </h3>
            <p className="text-slate-400 text-xs">
              Notice that as a verifier, you see the verified mathematical outcome without learning the tenant's private address or previous rent amount.
            </p>
          </div>
          <span className="text-xs font-mono text-slate-500">{history.length} Receipts</span>
        </div>

        {history.length === 0 ? (
          <div className="text-center py-8 text-slate-500 text-xs">
            No applicant proofs have been recorded yet. Visit the "Prove & Verify" page to generate your first zero-knowledge proof.
          </div>
        ) : (
          <div className="space-y-3">
            {history.map((h) => (
              <div
                key={h.id}
                className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-xs space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                    <span className="font-semibold text-white text-sm">{h.propertyTitle}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="badge-verified text-[10px]">VERIFIED BY CONSENSUS</span>
                    <span className="text-[11px] font-mono text-slate-500">{new Date(h.timestamp).toLocaleString()}</span>
                  </div>
                </div>

                {/* Disclosed Claims Readout */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="p-3 rounded-lg bg-emerald-950/15 border border-emerald-500/20">
                    <div className="font-semibold text-emerald-400 text-[11px] mb-1.5 flex items-center gap-1">
                      <Eye size={12} />
                      <span>Verified Claims Revealed:</span>
                    </div>
                    <ul className="space-y-1 text-slate-200 text-[11px]">
                      {h.disclosedClaims.map((claim, idx) => (
                        <li key={idx} className="flex items-center gap-1.5">
                          <Check size={11} className="text-emerald-400 shrink-0" />
                          <span>{claim.label}: <strong className="text-emerald-300">{claim.requirement} [PASSED]</strong></span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                    <div className="font-semibold text-slate-400 text-[11px] mb-1.5 flex items-center gap-1">
                      <EyeOff size={12} className="text-amber-400" />
                      <span>Data Protected (Kept Private From Verifier):</span>
                    </div>
                    <ul className="space-y-1 text-slate-400 text-[11px]">
                      {h.protectedClaims.map((prot, idx) => (
                        <li key={idx} className="flex items-center gap-1.5">
                          <span className="text-slate-500 font-bold">&times;</span>
                          <span>{prot} [SHIELDED]</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {h.txId && (
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 pt-2 border-t border-slate-900">
                    <span>Transaction Hash: {h.txId}</span>
                    {h.nullifierHex && (
                      <span>Nullifier: {h.nullifierHex.slice(0, 16)}...</span>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Request Modal */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="editorial-card w-full max-w-lg p-6 bg-[#0c1220] border-slate-700 shadow-2xl space-y-4 text-xs">
            <div className="flex items-start justify-between pb-3 border-b border-slate-800">
              <div>
                <h4 className="font-bold text-base text-white">Create Verification Request</h4>
                <p className="text-slate-400 text-xs">Specify minimum screening policy for applicants</p>
              </div>
              <button onClick={() => setCreateModalOpen(false)} className="text-slate-400 hover:text-white p-1">
                &times;
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Property Name / Community</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Westlake Gardens"
                  value={propertyTitle}
                  onChange={(e) => setPropertyTitle(e.target.value)}
                  className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Apartment / Unit</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Unit 302"
                    value={propertyUnit}
                    onChange={(e) => setPropertyUnit(e.target.value)}
                    className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Management / Landlord Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Pinnacle Living LLC"
                    value={verifierName}
                    onChange={(e) => setVerifierName(e.target.value)}
                    className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white"
                  />
                </div>
              </div>

              {/* Policy Thresholds */}
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-3">
                <div className="font-semibold text-slate-300 text-[11px] uppercase tracking-wide">
                  Policy Requirements
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-slate-400 mb-1 text-[11px]">Min Duration</label>
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        min="1"
                        max="60"
                        value={minMonths}
                        onChange={(e) => setMinMonths(Number(e.target.value))}
                        className="w-full p-2 rounded bg-slate-900 border border-slate-800 font-mono text-white text-xs"
                      />
                      <span className="text-slate-400">mo</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1 text-[11px]">Min Payment</label>
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        min="50"
                        max="100"
                        value={minScore}
                        onChange={(e) => setMinScore(Number(e.target.value))}
                        className="w-full p-2 rounded bg-slate-900 border border-slate-800 font-mono text-white text-xs"
                      />
                      <span className="text-slate-400">%</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1 text-[11px]">Max Violations</label>
                    <input
                      type="number"
                      min="0"
                      max="3"
                      value={maxViolations}
                      onChange={(e) => setMaxViolations(Number(e.target.value))}
                      className="w-full p-2 rounded bg-slate-900 border border-slate-800 font-mono text-white text-xs"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Additional Notes for Applicant</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Standard lease application check."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="btn-secondary text-xs py-2 px-4"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary text-xs py-2 px-5 font-semibold">
                  Create Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
