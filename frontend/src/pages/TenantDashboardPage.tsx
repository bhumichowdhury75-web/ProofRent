import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useWallet } from '../contexts/WalletContext';
import { useRentalData, type RentalCredentialRecord } from '../contexts/RentalDataContext';
import { getProofHistory } from '../lib/proofHistory';
import { ProofModal } from '../components/ProofModal';
import {
  Shield,
  Key,
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
  Clock,
  ArrowRight,
  ChevronRight,
  ExternalLink,
  Plus,
  FileCheck,
  AlertCircle,
  Copy,
  Check,
} from 'lucide-react';

export function TenantDashboardPage() {
  const { address, isConnected, connect, walletType } = useWallet();
  const { credentials, requests } = useRentalData();
  const history = getProofHistory();

  const [selectedCred, setSelectedCred] = useState<RentalCredentialRecord | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [proofModalOpen, setProofModalOpen] = useState(false);
  const [activeProofCred, setActiveProofCred] = useState<RentalCredentialRecord | null>(null);
  const [showPrivateAttributes, setShowPrivateAttributes] = useState(false);
  const [copied, setCopied] = useState(false);

  const pendingRequests = requests.filter((r) => r.status === 'pending');

  const openCredentialDetail = (cred: RentalCredentialRecord) => {
    setSelectedCred(cred);
    setShowPrivateAttributes(false);
    setDetailModalOpen(true);
  };

  const handleProve = (cred: RentalCredentialRecord) => {
    setActiveProofCred(cred);
    setProofModalOpen(true);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="container-custom py-8 space-y-8">
      {/* Wallet Status Banner */}
      <div className="editorial-card p-6 bg-slate-900/80 border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Shield size={22} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white">Tenant Credential Vault</h2>
              <span className="badge-verified text-[11px] py-0.5">Confidential</span>
            </div>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              {isConnected && address ? (
                <span>Connected: {address.slice(0, 10)}...{address.slice(-6)} ({walletType ?? '1AM'})</span>
              ) : (
                <span className="text-amber-400">Connect wallet to synchronize on-chain proofs</span>
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 w-full md:w-auto">
          {!isConnected && (
            <button onClick={() => connect('preprod')} className="btn-primary text-xs py-2 px-4 w-full md:w-auto">
              <Key size={14} />
              <span>Connect Wallet</span>
            </button>
          )}
          <Link to="/verify" className="btn-secondary text-xs py-2 px-4 w-full md:w-auto flex items-center justify-center gap-1.5">
            <span>Prove Rental History</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      {/* Main Grid: Credentials & Pending Requests */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Credentials Held */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">Credentials Held</h3>
              <p className="text-xs text-slate-400">Verifiable rental credentials stored in your private vault</p>
            </div>
            <span className="text-xs font-mono text-slate-500">{credentials.length} Credentials</span>
          </div>

          {credentials.length === 0 ? (
            <div className="editorial-card p-10 text-center bg-slate-900/30 border-dashed border-slate-800">
              <Shield size={32} className="text-slate-600 mx-auto mb-3" />
              <div className="text-sm font-semibold text-white mb-1">No Credentials in Vault</div>
              <p className="text-xs text-slate-400 mb-4 max-w-sm mx-auto">
                Ask your previous landlord to issue a ProofRent credential or issue a test credential.
              </p>
              <Link to="/issue" className="btn-secondary text-xs py-2 px-4">
                <span>Issue Test Credential</span>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {credentials.map((cred) => (
                <div
                  key={cred.id}
                  className="editorial-card p-5 bg-slate-900/70 border-slate-800 hover:border-slate-700 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80 mb-3">
                    <div className="flex items-center gap-2.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                      <h4 className="font-semibold text-white text-sm">{cred.propertyLabel}</h4>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="badge-verified text-[10px]">Active</span>
                      <span className="badge-private text-[10px]">Zero-Knowledge</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs mb-4">
                    <div>
                      <div className="text-slate-500 text-[11px]">Tenancy Duration</div>
                      <div className="font-mono font-semibold text-slate-200 mt-0.5">{cred.tenancyMonths} Months</div>
                    </div>
                    <div>
                      <div className="text-slate-500 text-[11px]">Payment Score</div>
                      <div className="font-mono font-semibold text-emerald-400 mt-0.5">{cred.paymentScore}% On-Time</div>
                    </div>
                    <div>
                      <div className="text-slate-500 text-[11px]">Infractions</div>
                      <div className="font-mono font-semibold text-slate-200 mt-0.5">{cred.violations} Unresolved</div>
                    </div>
                    <div>
                      <div className="text-slate-500 text-[11px]">Lease Status</div>
                      <div className="font-mono font-semibold text-slate-200 mt-0.5">
                        {cred.leaseCompleted ? 'Completed' : 'Terminated'}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 text-xs">
                    <div className="font-mono text-[11px] text-slate-500 truncate max-w-[200px] sm:max-w-xs">
                      Commitment: {cred.commitment.slice(0, 16)}...
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openCredentialDetail(cred)}
                        className="px-3 py-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs transition-colors"
                      >
                        Inspect Claims
                      </button>
                      <button
                        onClick={() => handleProve(cred)}
                        className="btn-primary text-xs py-1.5 px-3"
                      >
                        Prove Claims
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Col: Pending Landlord Verification Requests & Recent Activity */}
        <div className="space-y-6">
          {/* Pending Requests */}
          <div className="editorial-card p-5 bg-slate-900/80 border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Clock size={16} className="text-amber-400" />
                <span>Pending Verification Requests</span>
              </h3>
              <Link to="/requests" className="text-[11px] text-emerald-400 hover:text-emerald-300">
                View All
              </Link>
            </div>

            {pendingRequests.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-4">No pending landlord requests.</p>
            ) : (
              <div className="space-y-3">
                {pendingRequests.map((req) => (
                  <div key={req.id} className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-xs space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="font-semibold text-slate-200">{req.propertyTitle}</div>
                      <span className="badge-pending text-[10px] py-0.5 px-1.5">Required</span>
                    </div>
                    <div className="text-[11px] text-slate-400">Verifier: {req.verifierName}</div>
                    <div className="text-[11px] font-mono text-slate-400 flex items-center justify-between pt-1 border-t border-slate-800/80">
                      <span>Min: {req.minMonthsRequired} mo, {req.minPaymentScoreRequired}%</span>
                      <Link
                        to="/verify"
                        className="text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1"
                      >
                        <span>Fulfill</span>
                        <ChevronRight size={12} />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Verification Activity */}
          <div className="editorial-card p-5 bg-slate-900/80 border-slate-800">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-4">
              <FileCheck size={16} className="text-emerald-400" />
              <span>Recent Verification Receipts</span>
            </h3>

            {history.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-4">No recent verification proofs recorded.</p>
            ) : (
              <div className="space-y-2.5">
                {history.slice(0, 3).map((item) => (
                  <div key={item.id} className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-200 truncate">{item.propertyTitle}</span>
                      <span className="badge-verified text-[10px] py-0.5">Verified</span>
                    </div>
                    <div className="text-[11px] text-slate-500 font-mono truncate">
                      Tx: {item.txId ?? 'Preprod Consensus'}
                    </div>
                    <div className="text-[10px] text-slate-500">
                      {new Date(item.timestamp).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Credential Claim Detail Modal */}
      {detailModalOpen && selectedCred && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="editorial-card w-full max-w-lg p-6 bg-[#0c1220] border-slate-700 shadow-2xl space-y-5 text-xs text-slate-200">
            <div className="flex items-start justify-between pb-3 border-b border-slate-800">
              <div>
                <h4 className="font-bold text-base text-white">{selectedCred.propertyLabel}</h4>
                <p className="text-slate-400 text-xs">Rental Credential Claim Inventory</p>
              </div>
              <button
                onClick={() => setDetailModalOpen(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                &times;
              </button>
            </div>

            {/* Public Ledger Claims */}
            <div className="space-y-2">
              <div className="font-semibold text-slate-300 text-xs uppercase tracking-wide flex items-center justify-between">
                <span>On-Chain Commitment State</span>
                <span className="badge-verified text-[10px]">Public</span>
              </div>
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1.5 font-mono text-[11px]">
                <div className="flex justify-between">
                  <span className="text-slate-500">Status:</span>
                  <span className="text-emerald-400 uppercase font-bold">{selectedCred.status}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Commitment:</span>
                  <span className="text-slate-300 truncate max-w-[200px]">{selectedCred.commitment}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Issued Timestamp:</span>
                  <span className="text-slate-300">{new Date(selectedCred.issuedAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            {/* Provable Claims (Witnesses) */}
            <div className="space-y-2">
              <div className="font-semibold text-slate-300 text-xs uppercase tracking-wide flex items-center justify-between">
                <span>Provable Zero-Knowledge Claims</span>
                <span className="badge-private text-[10px]">Evaluated in ZK</span>
              </div>
              <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400">Tenancy Duration:</span>
                  <span className="font-mono text-emerald-400 font-bold">{selectedCred.tenancyMonths} Months</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400">On-Time Payment Reliability:</span>
                  <span className="font-mono text-emerald-400 font-bold">{selectedCred.paymentScore}%</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400">Unresolved Infractions:</span>
                  <span className="font-mono text-slate-200">{selectedCred.violations}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400">Lease Completed in Good Standing:</span>
                  <span className="font-mono text-slate-200">{selectedCred.leaseCompleted ? 'YES' : 'NO'}</span>
                </div>
              </div>
            </div>

            {/* Sensitive Data Toggle (Encourages User Trust) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="font-semibold text-slate-400 text-xs uppercase tracking-wide">
                  Sensitive Document Attributes
                </div>
                <button
                  onClick={() => setShowPrivateAttributes(!showPrivateAttributes)}
                  className="text-emerald-400 hover:text-emerald-300 text-xs flex items-center gap-1"
                >
                  {showPrivateAttributes ? <EyeOff size={13} /> : <Eye size={13} />}
                  <span>{showPrivateAttributes ? 'Hide Values' : 'View (Only You Can See)'}</span>
                </button>
              </div>

              {showPrivateAttributes ? (
                <div className="bg-amber-950/20 p-3 rounded-lg border border-amber-500/30 text-[11px] space-y-1.5 text-amber-200">
                  <div>Previous Physical Address: {selectedCred.privateDetails.previousAddress}</div>
                  <div>Exact Rent Amount: {selectedCred.privateDetails.exactRentMonthly}</div>
                  <div>Landlord Contact: {selectedCred.privateDetails.landlordContact}</div>
                  <div className="text-[10px] text-slate-400 pt-1 border-t border-amber-500/20">
                    ProofRent circuits never reveal these lines to prospective landlords.
                  </div>
                </div>
              ) : (
                <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800/80 text-[11px] text-slate-500 text-center font-mono">
                  [3 Private Attributes Shielded By Client Vault]
                </div>
              )}
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-800">
              <button
                onClick={() => setDetailModalOpen(false)}
                className="btn-secondary text-xs py-2 px-4"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Proof Modal */}
      <ProofModal
        isOpen={proofModalOpen}
        onClose={() => setProofModalOpen(false)}
        credential={activeProofCred}
      />
    </div>
  );
}
