import { useState } from 'react';
import { useWallet } from '../contexts/WalletContext';
import { useRentalData } from '../contexts/RentalDataContext';
import { pureCircuits } from '../managed/contract/index.js';
import {
  Shield,
  Key,
  CheckCircle,
  AlertCircle,
  FileCheck,
  Building,
  User,
  Calendar,
  DollarSign,
  Lock,
  Plus,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';

export function IssueCredentialPage() {
  const { address, isConnected, connect, session } = useWallet();
  const { addCredential, credentials, revokeCredentialStatus } = useRentalData();

  const [tenantAddress, setTenantAddress] = useState('0x10b9812049b581e92049b581e92049b581e92049b581e92049b581e92049b581');
  const [propertyLabel, setPropertyLabel] = useState('Silverstone Park — Unit 302');
  const [tenancyMonths, setTenancyMonths] = useState('14');
  const [paymentScore, setPaymentScore] = useState('99');
  const [violations, setViolations] = useState('0');
  const [leaseCompleted, setLeaseCompleted] = useState(true);

  // Private fields
  const [previousAddress, setPreviousAddress] = useState('302 Silverstone Park Way, Denver, CO 80202');
  const [exactRent, setExactRent] = useState('$2,200 / month');
  const [landlordContact, setLandlordContact] = useState('leasing@silverstonepark.com');

  const [status, setStatus] = useState<'idle' | 'issuing' | 'issued' | 'error'>('idle');
  const [issuedCommitment, setIssuedCommitment] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleIssue = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('issuing');
    setErrorMessage(null);

    try {
      const monthsNum = parseInt(tenancyMonths, 10);
      const scoreNum = parseInt(paymentScore, 10);
      const violsNum = parseInt(violations, 10);

      if (isNaN(monthsNum) || monthsNum <= 0) throw new Error('Please enter valid tenancy duration in months.');
      if (isNaN(scoreNum) || scoreNum < 0 || scoreNum > 100) throw new Error('Please enter payment score between 0 and 100.');

      // Generate random salt for blinding factor
      const saltBytes = new Uint8Array(32);
      crypto.getRandomValues(saltBytes);
      const saltHex = Array.from(saltBytes, (b) => b.toString(16).padStart(2, '0')).join('');

      // Create tenant id bytes
      const tenantBytes = new Uint8Array(32);
      for (let i = 0; i < 32; i++) {
        tenantBytes[i] = parseInt(tenantAddress.slice(2 + i * 2, 4 + i * 2) || '0', 16) || i;
      }

      // Compute commitment using real Compact pure circuit!
      const commitmentBytes = pureCircuits.credentialCommitment(tenantBytes, saltBytes);
      const commitmentHex = Array.from(commitmentBytes, (b) => b.toString(16).padStart(2, '0')).join('');

      // Add to store
      addCredential({
        propertyLabel,
        issuerAddress: address ?? '0x8841a02938485720194857201948572019485720194857201948572019485720',
        tenantAddress,
        tenancyMonths: monthsNum,
        paymentScore: scoreNum,
        violations: violsNum,
        completedLeases: 1,
        leaseCompleted,
        credentialSalt: saltHex,
        commitment: commitmentHex,
        privateDetails: {
          previousAddress,
          exactRentMonthly: exactRent,
          landlordName: 'Silverstone Management Corp',
          landlordContact,
          leaseDocumentId: `DOC-${Date.now()}-CONFIDENTIAL`,
        },
      });

      setIssuedCommitment(commitmentHex);
      setStatus('issued');
    } catch (err: any) {
      console.error(err);
      setStatus('error');
      setErrorMessage(err?.message ?? 'Failed to issue credential.');
    }
  };

  return (
    <div className="container-custom py-8 max-w-4xl space-y-8">
      {/* Title */}
      <div>
        <div className="badge-verified mb-2">Landlord Authority Portal</div>
        <h2 className="text-3xl font-extrabold text-white tracking-tight">Issue Verifiable Rental Credential</h2>
        <p className="text-slate-400 text-sm mt-1">
          Issue a privacy-preserving rental credential to a previous tenant. The cryptographic commitment is recorded for zero-knowledge verification.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Issuance Form */}
        <div className="lg:col-span-8 editorial-card p-6 sm:p-8 bg-slate-900/80 border-slate-800">
          <form onSubmit={handleIssue} className="space-y-6 text-xs">
            {/* Tenant Address */}
            <div>
              <label className="block text-slate-300 font-medium mb-1.5 flex items-center justify-between">
                <span>Tenant Midnight Address or Coin Public Key</span>
                <span className="text-[11px] text-slate-500">Target Recipient</span>
              </label>
              <input
                type="text"
                required
                value={tenantAddress}
                onChange={(e) => setTenantAddress(e.target.value)}
                placeholder="0x..."
                className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-800 font-mono text-xs text-white"
              />
            </div>

            {/* Property Label */}
            <div>
              <label className="block text-slate-300 font-medium mb-1.5">Property or Lease Identifier</label>
              <input
                type="text"
                required
                value={propertyLabel}
                onChange={(e) => setPropertyLabel(e.target.value)}
                placeholder="e.g. Cedar Ridge Apartments — Unit 412"
                className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white"
              />
            </div>

            {/* Verifiable Claim Thresholds */}
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-4">
              <div className="font-semibold text-slate-200 text-xs flex items-center gap-2">
                <Shield size={14} className="text-emerald-400" />
                <span>Verified Claims (Evaluated in Zero Knowledge)</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-slate-400 mb-1 text-[11px]">Tenancy Duration</label>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      min="1"
                      required
                      value={tenancyMonths}
                      onChange={(e) => setTenancyMonths(e.target.value)}
                      className="w-full p-2 rounded-lg bg-slate-900 border border-slate-800 font-mono text-white text-xs"
                    />
                    <span className="text-slate-400 text-xs">mo</span>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 text-[11px]">On-Time Rent Score</label>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      required
                      value={paymentScore}
                      onChange={(e) => setPaymentScore(e.target.value)}
                      className="w-full p-2 rounded-lg bg-slate-900 border border-slate-800 font-mono text-white text-xs"
                    />
                    <span className="text-slate-400 text-xs">%</span>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 text-[11px]">Unresolved Infractions</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={violations}
                    onChange={(e) => setViolations(e.target.value)}
                    className="w-full p-2 rounded-lg bg-slate-900 border border-slate-800 font-mono text-white text-xs"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="lease_completed"
                  checked={leaseCompleted}
                  onChange={(e) => setLeaseCompleted(e.target.checked)}
                  className="accent-emerald-500 rounded"
                />
                <label htmlFor="lease_completed" className="text-xs text-slate-300 cursor-pointer">
                  Lease completed in good standing (no evictions or contract breaches)
                </label>
              </div>
            </div>

            {/* Confidential Record Details (Stored with tenant, never on-chain) */}
            <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-400 text-[11px] uppercase tracking-wide">
                  Private Reference Attributes (Confidential)
                </span>
                <span className="badge-private text-[10px]">Stays Private</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-500 text-[11px] mb-1">Street Address</label>
                  <input
                    type="text"
                    value={previousAddress}
                    onChange={(e) => setPreviousAddress(e.target.value)}
                    className="w-full p-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 text-[11px] mb-1">Monthly Rent</label>
                  <input
                    type="text"
                    value={exactRent}
                    onChange={(e) => setExactRent(e.target.value)}
                    className="w-full p-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300"
                  />
                </div>
              </div>
            </div>

            {/* Success message */}
            {status === 'issued' && issuedCommitment && (
              <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-xs space-y-2">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                  <CheckCircle size={16} />
                  <span>Credential Successfully Issued!</span>
                </div>
                <p className="text-slate-300">
                  The rental credential was registered into the client vault. The tenant can now prove duration and payment reliability to new landlords without revealing the street address.
                </p>
                <div className="p-2 bg-slate-950 rounded border border-slate-800 font-mono text-[11px] text-slate-400 break-all">
                  Commitment Hash: {issuedCommitment}
                </div>
              </div>
            )}

            {/* Error message */}
            {status === 'error' && errorMessage && (
              <div className="p-4 rounded-xl bg-red-950/20 border border-red-500/30 text-xs text-red-200">
                <div className="flex items-center gap-2 font-bold mb-1">
                  <AlertCircle size={16} className="text-red-400" />
                  <span>Issuance Error</span>
                </div>
                <p>{errorMessage}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={status === 'issuing'}
              className="btn-primary w-full text-xs py-3 font-semibold"
            >
              {status === 'issuing' ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
                  <span>Computing Commitment & Registering...</span>
                </>
              ) : (
                <>
                  <FileCheck size={15} />
                  <span>Issue Verifiable Credential</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Col: Info & Recently Issued Credentials */}
        <div className="lg:col-span-4 space-y-6">
          <div className="editorial-card p-5 bg-slate-900/80 border-slate-800 text-xs space-y-3">
            <h4 className="font-bold text-white text-sm flex items-center gap-2">
              <Lock size={15} className="text-emerald-400" />
              <span>How Landlord Issuance Works</span>
            </h4>
            <p className="text-slate-400 leading-relaxed text-xs">
              When you issue a credential, ProofRent computes a deterministic commitment:
            </p>
            <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 font-mono text-[10px] text-emerald-400">
              Commitment = H(TenantID, BlindingSalt)
            </div>
            <p className="text-slate-400 leading-relaxed text-xs">
              The commitment is placed in the public contract registry. When the tenant applies for a new home, they formulate a zero-knowledge proof that unlocks their eligibility without exposing your contact info or their past rent.
            </p>
          </div>

          {/* Recently Issued */}
          <div className="editorial-card p-5 bg-slate-900/80 border-slate-800 text-xs space-y-3">
            <h4 className="font-bold text-white text-sm">Issued Credentials ({credentials.length})</h4>
            <div className="space-y-2">
              {credentials.slice(0, 3).map((c) => (
                <div key={c.id} className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-200 truncate">{c.propertyLabel}</span>
                    <span className="badge-verified text-[10px] py-0.5">{c.status}</span>
                  </div>
                  <div className="text-[10px] font-mono text-slate-500 truncate">
                    Commitment: {c.commitment.slice(0, 16)}...
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
