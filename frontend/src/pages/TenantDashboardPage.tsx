import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useWallet } from '../contexts/WalletContext';
import { useRentalData, type RentalCredentialRecord } from '../contexts/RentalDataContext';
import { getProofHistory } from '../lib/proofHistory';
import { ModalFrame } from '../components/ModalFrame';
import { ProofModal } from '../components/ProofModal';
import {
  ArrowRight,
  Check,
  ChevronRight,
  Clock,
  Copy,
  Eye,
  EyeOff,
  FileCheck,
  Key,
  Lock,
  Plus,
  Shield,
} from '../components/PrismIcons';

const seededCredentialIds = new Set(['cred_cedar_ridge_01', 'cred_maple_court_02']);
const seededRequestIds = new Set(['req_silverstone_01', 'req_beacon_hill_02']);

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

  const pendingRequests = requests.filter((request) => request.status === 'pending');
  const activeCredentials = credentials.filter((credential) => credential.status === 'active');
  const verifiedReceiptCount = history.filter((item) => item.result === 'verified').length;
  const demoCredentialCount = credentials.filter((credential) => seededCredentialIds.has(credential.id)).length;
  const demoRequestCount = requests.filter((request) => seededRequestIds.has(request.id)).length;

  const openCredentialDetail = (credential: RentalCredentialRecord) => {
    setSelectedCred(credential);
    setShowPrivateAttributes(false);
    setDetailModalOpen(true);
  };

  const handleProve = (credential: RentalCredentialRecord) => {
    setActiveProofCred(credential);
    setProofModalOpen(true);
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="pr-workspace">
      <div className="container-custom py-10 lg:py-14 space-y-8">
        <header className="pr-workspace-header grid gap-8 lg:grid-cols-[minmax(0,1fr)_260px] lg:items-end">
          <div>
            <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.18em] text-[#f59cf2]">
              <span className="h-px w-7 bg-gradient-to-r from-[#f59cf2] to-[#6ce5dd]" />
              Tenant observatory / private vault
            </div>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <h1 className="text-4xl font-semibold tracking-[-0.06em] text-white sm:text-5xl">Your proof orbit</h1>
              <span className="badge-private">Selective disclosure</span>
            </div>
            <p className="pr-workspace-lead mt-4 max-w-2xl text-sm leading-7 text-[#aaa7b9]">
              Read the credentials held in your browser vault, watch incoming screening scopes, and decide exactly what a verifier can learn.
            </p>
          </div>
          <div className="pr-workspace-art relative hidden min-h-[150px] items-center justify-center lg:flex">
            <div className="absolute h-36 w-36 rounded-full border border-[#bf9cff]/20 shadow-[0_0_70px_rgba(191,156,255,.15)]" />
            <div className="absolute h-24 w-44 rotate-[-18deg] rounded-[50%] border border-[#6ce5dd]/30" />
            <img src="/proofrent-orb.svg" alt="" aria-hidden="true" className="relative h-20 w-20 drop-shadow-[0_0_22px_rgba(191,156,255,.55)]" />
          </div>
        </header>

        <section className="editorial-card relative overflow-hidden p-5 sm:p-6" aria-label="Vault connection status">
          <div className="absolute -right-16 -top-24 h-56 w-56 rounded-full bg-[#bf9cff]/[0.06] blur-3xl" />
          <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-4">
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-[#bf9cff]/25 bg-[#bf9cff]/[0.09] text-[#bf9cff]">
                <Lock size={21} />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-base font-semibold text-white">Confidential tenant vault</h2>
                  <span className="badge-private text-[10px]">Browser-held</span>
                </div>
                <p className="mt-1 max-w-xl text-xs leading-5 text-[#9695a9]">
                  {isConnected && address ? (
                    <span>
                      Wallet linked · {address.slice(0, 10)}…{address.slice(-6)} · {walletType ?? 'Midnight'}
                    </span>
                  ) : (
                    <span className="text-[#f4cf81]">Wallet not linked. Connect when you are ready to submit a proof.</span>
                  )}
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              {!isConnected && (
                <button type="button" onClick={() => void connect('preprod')} className="btn-primary text-xs">
                  <Key size={14} />
                  Connect wallet
                </button>
              )}
              <Link to="/verify" className="btn-secondary text-xs">
                Open proof studio
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-2 gap-3 lg:grid-cols-4" aria-label="Vault overview">
          {[
            { label: 'Vault records', value: credentials.length, note: 'credentials held', color: 'text-[#bf9cff]' },
            { label: 'Active orbit', value: activeCredentials.length, note: 'usable commitments', color: 'text-[#6ce5dd]' },
            { label: 'Open scopes', value: pendingRequests.length, note: 'requests awaiting you', color: 'text-[#f4cf81]' },
            { label: 'Proof receipts', value: verifiedReceiptCount, note: 'verified outcomes', color: 'text-[#f59cf2]' },
          ].map((metric) => (
            <div key={metric.label} className="editorial-card bg-white/[0.035] p-4 sm:p-5">
              <div className="text-[10px] font-mono uppercase tracking-[0.14em] text-[#777486]">{metric.label}</div>
              <div className={`mt-3 text-3xl font-semibold tracking-[-0.06em] ${metric.color}`}>{metric.value}</div>
              <div className="mt-1 text-[11px] text-[#9695a9]">{metric.note}</div>
            </div>
          ))}
        </section>

        <div className="grid gap-8 xl:grid-cols-[minmax(0,1.45fr)_minmax(320px,.75fr)]">
          <section className="space-y-4" aria-labelledby="credentials-heading">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <div className="text-[11px] font-mono uppercase tracking-[0.16em] text-[#6ce5dd]">Signal archive</div>
                <h2 id="credentials-heading" className="mt-1 text-xl font-semibold tracking-[-0.04em] text-white">Credentials in orbit</h2>
                <p className="mt-1 text-xs text-[#9695a9]">Private witnesses remain in your vault until you choose to prove a policy.</p>
              </div>
              <Link to="/issue" className="btn-secondary text-xs">
                <Plus size={14} />
                Add credential
              </Link>
            </div>

            {credentials.length === 0 ? (
              <div className="editorial-card border-dashed bg-white/[0.025] p-10 text-center">
                <Shield size={30} className="mx-auto mb-3 text-[#777486]" />
                <h3 className="text-sm font-semibold text-white">No credentials in this vault</h3>
                <p className="mx-auto mt-2 max-w-sm text-xs leading-5 text-[#9695a9]">
                  Ask a previous landlord to issue a credential, or create a local test credential to explore selective disclosure.
                </p>
                <Link to="/issue" className="btn-secondary mt-5 text-xs">Issue a credential</Link>
              </div>
            ) : (
              <div className="space-y-3">
                {credentials.map((credential) => {
                  const isDemo = seededCredentialIds.has(credential.id);
                  return (
                    <article key={credential.id} className="editorial-card group bg-white/[0.035] p-5 hover:border-[#bf9cff]/35">
                      <div className="flex flex-col gap-3 border-b border-white/[0.08] pb-4 sm:flex-row sm:items-start sm:justify-between">
                        <div className="flex items-start gap-3">
                          <span className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${credential.status === 'active' ? 'bg-[#6ce5dd] shadow-[0_0_12px_#6ce5dd]' : 'bg-[#f4cf81]'}`} />
                          <div>
                            <h3 className="text-sm font-semibold text-white">{credential.propertyLabel}</h3>
                            <p className="mt-1 text-[11px] text-[#777486]">Issued {new Date(credential.issuedAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2 sm:justify-end">
                          <span className={credential.status === 'active' ? 'badge-verified text-[10px]' : 'badge-pending text-[10px]'}>
                            {credential.status === 'active' ? 'Active record' : 'Revoked'}
                          </span>
                          <span className="badge-private text-[10px]">ZK-ready</span>
                          {isDemo && <span className="badge-pending text-[10px]">Local demo</span>}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-x-5 gap-y-4 py-4 sm:grid-cols-4">
                        <div>
                          <div className="text-[10px] uppercase tracking-wide text-[#777486]">Tenure</div>
                          <div className="mt-1 font-mono text-sm text-[#e9e5f4]">{credential.tenancyMonths} mo</div>
                        </div>
                        <div>
                          <div className="text-[10px] uppercase tracking-wide text-[#777486]">Payment signal</div>
                          <div className="mt-1 font-mono text-sm text-[#6ce5dd]">{credential.paymentScore}%</div>
                        </div>
                        <div>
                          <div className="text-[10px] uppercase tracking-wide text-[#777486]">Infractions</div>
                          <div className="mt-1 font-mono text-sm text-[#e9e5f4]">{credential.violations}</div>
                        </div>
                        <div>
                          <div className="text-[10px] uppercase tracking-wide text-[#777486]">Completed leases</div>
                          <div className="mt-1 font-mono text-sm text-[#e9e5f4]">{credential.completedLeases}</div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-3 border-t border-white/[0.08] pt-3 text-xs sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex min-w-0 items-center gap-2 font-mono text-[10px] text-[#777486]">
                          <span className="truncate">Commitment {credential.commitment.slice(0, 16)}…</span>
                          <button
                            type="button"
                            onClick={() => void copyToClipboard(credential.commitment)}
                            className="shrink-0 rounded-md p-1 text-[#9695a9] hover:bg-white/[0.07] hover:text-white"
                            aria-label={`Copy commitment for ${credential.propertyLabel}`}
                          >
                            {copied ? <Check size={13} className="text-[#6ce5dd]" /> : <Copy size={13} />}
                          </button>
                        </div>
                        <div className="flex gap-2">
                          <button type="button" onClick={() => openCredentialDetail(credential)} className="btn-secondary px-3 py-2 text-[11px]">
                            Inspect claims
                          </button>
                          <button type="button" onClick={() => handleProve(credential)} className="btn-primary px-3 py-2 text-[11px]">
                            Prove claims
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </section>

          <aside className="space-y-5">
            <section className="editorial-card bg-white/[0.035] p-5" aria-labelledby="requests-heading">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 text-[#f4cf81]"><Clock size={15} /><span className="text-[10px] font-mono uppercase tracking-[0.14em]">Incoming scope</span></div>
                  <h2 id="requests-heading" className="mt-2 text-base font-semibold text-white">Pending requests</h2>
                </div>
                <Link to="/requests" className="text-[11px] font-semibold text-[#bf9cff] hover:text-white">All requests</Link>
              </div>
              <p className="mt-2 text-xs leading-5 text-[#9695a9]">Landlords see a pass/fail result, never the private values behind it.</p>

              {pendingRequests.length === 0 ? (
                <div className="mt-5 rounded-xl border border-dashed border-white/10 p-5 text-center text-xs text-[#777486]">No pending screening scopes.</div>
              ) : (
                <div className="mt-5 space-y-3">
                  {pendingRequests.slice(0, 3).map((request) => (
                    <div key={request.id} className="rounded-xl border border-white/[0.09] bg-[#090910]/60 p-3.5">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="text-xs font-semibold text-[#eeeaf9]">{request.propertyTitle}</h3>
                          <p className="mt-1 text-[11px] text-[#777486]">{request.propertyUnit} · {request.verifierName}</p>
                        </div>
                        <span className="badge-pending px-2 py-1 text-[9px]">Pending</span>
                      </div>
                      <div className="mt-3 flex items-center justify-between border-t border-white/[0.08] pt-2 font-mono text-[10px] text-[#9695a9]">
                        <span>≥ {request.minMonthsRequired} mo · ≥ {request.minPaymentScoreRequired}%</span>
                        <Link to="/verify" className="flex items-center gap-1 font-sans font-semibold text-[#6ce5dd] hover:text-white">
                          Fulfill <ChevronRight size={12} />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section className="editorial-card bg-white/[0.035] p-5" aria-labelledby="receipts-heading">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <FileCheck size={16} className="text-[#6ce5dd]" />
                  <h2 id="receipts-heading" className="text-sm font-semibold text-white">Proof receipts</h2>
                </div>
                <span className="font-mono text-[10px] text-[#777486]">{history.length} local</span>
              </div>
              <p className="mt-2 text-[11px] leading-5 text-[#9695a9]">Outcomes recorded by this browser after proof runs.</p>
              {history.length === 0 ? (
                <p className="py-6 text-center text-xs text-[#777486]">No proof receipts yet.</p>
              ) : (
                <div className="mt-4 space-y-2.5">
                  {history.slice(0, 3).map((item) => (
                    <div key={item.id} className="rounded-xl border border-white/[0.08] bg-[#090910]/55 p-3">
                      <div className="flex items-start justify-between gap-2">
                        <span className="truncate text-xs font-medium text-[#e9e5f4]">{item.propertyTitle ?? 'Independent verification'}</span>
                        <span className={item.result === 'verified' ? 'badge-verified px-2 py-1 text-[9px]' : 'badge-pending px-2 py-1 text-[9px]'}>
                          {item.result === 'verified' ? 'Verified' : 'Failed'}
                        </span>
                      </div>
                      <div className="mt-2 flex items-center justify-between gap-2 font-mono text-[10px] text-[#777486]">
                        <span className="truncate">{item.txId ? `Tx ${item.txId.slice(0, 13)}…` : 'No transaction hash'}</span>
                        <span>{new Date(item.timestamp).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </aside>
        </div>

        <div className="flex flex-col gap-2 rounded-xl border border-[#bf9cff]/20 bg-[#bf9cff]/[0.055] px-4 py-3 text-[11px] leading-5 text-[#aaa7b9] sm:flex-row sm:items-center">
          <Shield size={15} className="shrink-0 text-[#bf9cff]" />
          <span><strong className="text-[#e9e5f4]">Local demo notice:</strong> {demoCredentialCount + demoRequestCount > 0 ? `${demoCredentialCount + demoRequestCount} starter record${demoCredentialCount + demoRequestCount === 1 ? '' : 's'} detected in this browser. ` : ''}Seeded records and sample activity are local demo data, not on-chain verified. Only a submitted proof produces a network receipt.</span>
        </div>
      </div>

      {detailModalOpen && selectedCred && (
        <ModalFrame
          title={`Credential claims: ${selectedCred.propertyLabel}`}
          onClose={() => setDetailModalOpen(false)}
          wide
        >
          <div className="space-y-6 text-xs text-[#e9e5f4]">
            <div className="flex flex-wrap items-center gap-2">
              <span className={selectedCred.status === 'active' ? 'badge-verified' : 'badge-pending'}>{selectedCred.status === 'active' ? 'Active record' : 'Revoked record'}</span>
              <span className="badge-private">Private witness values</span>
              {seededCredentialIds.has(selectedCred.id) && <span className="badge-pending">Local demo · not on-chain verified</span>}
            </div>

            <section className="space-y-2" aria-labelledby="commitment-state-heading">
              <div className="flex items-center justify-between gap-3">
                <h3 id="commitment-state-heading" className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#aaa7b9]">Commitment metadata</h3>
                <span className="badge-private text-[10px]">Public shape only</span>
              </div>
              <div className="space-y-2 rounded-xl border border-white/[0.09] bg-[#090910]/70 p-4 font-mono text-[11px]">
                <div className="flex items-start justify-between gap-4"><span className="text-[#777486]">Status</span><span className="text-[#6ce5dd]">{selectedCred.status.toUpperCase()}</span></div>
                <div className="flex items-start justify-between gap-4"><span className="text-[#777486]">Commitment</span><span className="max-w-[65%] break-all text-right text-[#e9e5f4]">{selectedCred.commitment}</span></div>
                <div className="flex items-start justify-between gap-4"><span className="text-[#777486]">Issued</span><span className="text-right text-[#e9e5f4]">{new Date(selectedCred.issuedAt).toLocaleDateString()}</span></div>
              </div>
            </section>

            <section className="space-y-2" aria-labelledby="zk-claims-heading">
              <div className="flex items-center justify-between gap-3">
                <h3 id="zk-claims-heading" className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#aaa7b9]">Claims available to prove</h3>
                <span className="badge-private text-[10px]">Evaluated privately</span>
              </div>
              <div className="grid gap-2 rounded-xl border border-white/[0.09] bg-white/[0.025] p-4 sm:grid-cols-2">
                <div className="flex items-center justify-between gap-3 border-b border-white/[0.07] pb-2 sm:border-b-0"><span className="text-[#9695a9]">Tenure duration</span><strong className="font-mono text-[#6ce5dd]">{selectedCred.tenancyMonths} mo</strong></div>
                <div className="flex items-center justify-between gap-3 border-b border-white/[0.07] pb-2 sm:border-b-0"><span className="text-[#9695a9]">Payment reliability</span><strong className="font-mono text-[#6ce5dd]">{selectedCred.paymentScore}%</strong></div>
                <div className="flex items-center justify-between gap-3"><span className="text-[#9695a9]">Unresolved infractions</span><strong className="font-mono text-[#e9e5f4]">{selectedCred.violations}</strong></div>
                <div className="flex items-center justify-between gap-3"><span className="text-[#9695a9]">Lease completed</span><strong className="font-mono text-[#e9e5f4]">{selectedCred.leaseCompleted ? 'YES' : 'NO'}</strong></div>
              </div>
            </section>

            <section className="space-y-2" aria-labelledby="private-attributes-heading">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h3 id="private-attributes-heading" className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#aaa7b9]">Sensitive document attributes</h3>
                <button
                  type="button"
                  onClick={() => setShowPrivateAttributes((visible) => !visible)}
                  aria-pressed={showPrivateAttributes}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#bf9cff] hover:text-white"
                >
                  {showPrivateAttributes ? <EyeOff size={14} /> : <Eye size={14} />}
                  {showPrivateAttributes ? 'Hide values' : 'Reveal in this vault'}
                </button>
              </div>
              {showPrivateAttributes ? (
                <div className="space-y-1.5 rounded-xl border border-[#f59cf2]/25 bg-[#f59cf2]/[0.06] p-4 text-[11px] text-[#e9d4ed]">
                  <div>Previous address: {selectedCred.privateDetails.previousAddress}</div>
                  <div>Exact rent amount: {selectedCred.privateDetails.exactRentMonthly}</div>
                  <div>Landlord: {selectedCred.privateDetails.landlordName}</div>
                  <div>Landlord contact: {selectedCred.privateDetails.landlordContact}</div>
                  <div className="border-t border-[#f59cf2]/15 pt-2 text-[#9695a9]">These values are shown only inside this local browser view and are not included in a proof result.</div>
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-white/10 bg-[#090910]/60 p-4 text-center font-mono text-[11px] text-[#777486]">[Private attributes shielded by the client vault]</div>
              )}
            </section>
          </div>
        </ModalFrame>
      )}

      <ProofModal isOpen={proofModalOpen} onClose={() => setProofModalOpen(false)} credential={activeProofCred} />
    </div>
  );
}
