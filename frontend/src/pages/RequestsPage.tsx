import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { useRentalData } from '../contexts/RentalDataContext';
import { getProofHistory } from '../lib/proofHistory';
import { ModalFrame } from '../components/ModalFrame';
import {
  ArrowRight,
  Building,
  Check,
  CheckCircle,
  Eye,
  EyeOff,
  FileCheck,
  Plus,
  Shield,
  UserCheck,
} from '../components/PrismIcons';

const seededRequestIds = new Set(['req_silverstone_01', 'req_beacon_hill_02']);

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

  const pendingCount = requests.filter((request) => request.status === 'pending').length;
  const verifiedCount = requests.filter((request) => request.status === 'verified').length;
  const demoRequestCount = requests.filter((request) => seededRequestIds.has(request.id)).length;

  const handleCreate = (event: FormEvent) => {
    event.preventDefault();
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
    <div className="pr-workspace">
      <div className="container-custom max-w-6xl space-y-8 py-10 lg:py-14">
        <header className="pr-workspace-header grid gap-8 lg:grid-cols-[minmax(0,1fr)_240px] lg:items-end">
          <div>
            <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.18em] text-[#f59cf2]">
              <span className="h-px w-7 bg-gradient-to-r from-[#f59cf2] to-[#6ce5dd]" />
              Observatory / verifier scopes
            </div>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <h1 className="text-4xl font-semibold tracking-[-0.06em] text-white sm:text-5xl">Request a proof</h1>
              <span className="badge-private">Privacy-first screening</span>
            </div>
            <p className="pr-workspace-lead mt-4 max-w-2xl text-sm leading-7 text-[#aaa7b9]">
              Set the policy you need verified. Applicants can satisfy the policy with a zero-knowledge result while their address, rent, and landlord history stay shielded.
            </p>
          </div>
          <div className="pr-workspace-art relative hidden min-h-[145px] items-center justify-center lg:flex">
            <div className="absolute h-32 w-32 rounded-full border border-[#6ce5dd]/20 shadow-[0_0_60px_rgba(108,229,221,.13)]" />
            <div className="absolute h-20 w-40 rotate-[25deg] rounded-[50%] border border-[#f59cf2]/30" />
            <img src="/proofrent-orb.svg" alt="" aria-hidden="true" className="relative h-[72px] w-[72px] drop-shadow-[0_0_20px_rgba(108,229,221,.45)]" />
          </div>
        </header>

        <div className="flex flex-col gap-4 rounded-xl border border-[#bf9cff]/20 bg-[#bf9cff]/[0.055] px-4 py-3 text-[11px] leading-5 text-[#aaa7b9] sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-2">
            <Shield size={15} className="mt-0.5 shrink-0 text-[#bf9cff]" />
            <span><strong className="text-[#e9e5f4]">Local demo boundary:</strong> {demoRequestCount > 0 ? `${demoRequestCount} starter request${demoRequestCount === 1 ? '' : 's'} loaded. ` : ''}Seeded records are local browser sample data, not on-chain verified. Review a transaction receipt independently before treating a result as network-attested.</span>
          </div>
          <span className="shrink-0 font-mono text-[10px] uppercase tracking-[0.12em] text-[#bf9cff]">Preprod workspace</span>
        </div>

        <section className="grid grid-cols-2 gap-3 lg:grid-cols-4" aria-label="Request overview">
          {[
            { label: 'Total scopes', value: requests.length, note: 'policies created', color: 'text-[#bf9cff]' },
            { label: 'Awaiting proof', value: pendingCount, note: 'need applicant action', color: 'text-[#f4cf81]' },
            { label: 'Satisfied', value: verifiedCount, note: 'request status', color: 'text-[#6ce5dd]' },
            { label: 'Receipt entries', value: history.length, note: 'browser-local history', color: 'text-[#f59cf2]' },
          ].map((metric) => (
            <div key={metric.label} className="editorial-card bg-white/[0.035] p-4 sm:p-5">
              <div className="text-[10px] font-mono uppercase tracking-[0.14em] text-[#777486]">{metric.label}</div>
              <div className={`mt-3 text-3xl font-semibold tracking-[-0.06em] ${metric.color}`}>{metric.value}</div>
              <div className="mt-1 text-[11px] text-[#9695a9]">{metric.note}</div>
            </div>
          ))}
        </section>

        <section className="space-y-4" aria-labelledby="request-list-heading">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="text-[11px] font-mono uppercase tracking-[0.16em] text-[#6ce5dd]">Policy constellation</div>
              <h2 id="request-list-heading" className="mt-1 text-xl font-semibold tracking-[-0.04em] text-white">Active verification scopes</h2>
              <p className="mt-1 text-xs text-[#9695a9]">Each scope describes the minimum claims an applicant must satisfy.</p>
            </div>
            <button type="button" onClick={() => setCreateModalOpen(true)} className="btn-primary self-start text-xs sm:self-auto">
              <Plus size={15} />
              Create verification request
            </button>
          </div>

          {requests.length === 0 ? (
            <div className="editorial-card border-dashed bg-white/[0.025] p-12 text-center">
              <Building size={30} className="mx-auto mb-3 text-[#777486]" />
              <h3 className="text-sm font-semibold text-white">No request scopes yet</h3>
              <p className="mx-auto mt-2 max-w-sm text-xs leading-5 text-[#9695a9]">Create a property policy and send an applicant to the proof studio.</p>
              <button type="button" onClick={() => setCreateModalOpen(true)} className="btn-secondary mt-5 text-xs">Create the first scope</button>
            </div>
          ) : (
            <div className="grid gap-4 lg:grid-cols-2">
              {requests.map((request) => {
                const isDemo = seededRequestIds.has(request.id);
                const statusLabel = request.status === 'verified' ? 'Proof satisfied' : request.status === 'rejected' ? 'Rejected' : 'Awaiting proof';
                return (
                  <article key={request.id} className="editorial-card flex flex-col justify-between bg-white/[0.035] p-5 hover:border-[#bf9cff]/35">
                    <div>
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex min-w-0 items-start gap-3">
                          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-[#bf9cff]/20 bg-[#bf9cff]/[0.08] text-[#bf9cff]"><Building size={17} /></div>
                          <div className="min-w-0">
                            <h3 className="truncate text-sm font-semibold text-white">{request.propertyTitle}</h3>
                            <p className="mt-1 text-[11px] text-[#9695a9]">{request.propertyUnit} · {request.verifierName}</p>
                          </div>
                        </div>
                        <span className={request.status === 'verified' ? 'badge-verified text-[10px]' : 'badge-pending text-[10px]'}>{statusLabel}</span>
                      </div>

                      <div className="mt-5 rounded-xl border border-white/[0.09] bg-[#090910]/60 p-4">
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.13em] text-[#aaa7b9]"><UserCheck size={14} className="text-[#6ce5dd]" />Required signal</div>
                          {isDemo && <span className="badge-pending px-2 py-1 text-[9px]">Local demo</span>}
                        </div>
                        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                          <div><span className="block text-[10px] text-[#777486]">Tenancy</span><strong className="mt-1 block font-mono text-xs text-[#6ce5dd]">≥ {request.minMonthsRequired} mo</strong></div>
                          <div><span className="block text-[10px] text-[#777486]">Payment</span><strong className="mt-1 block font-mono text-xs text-[#6ce5dd]">≥ {request.minPaymentScoreRequired}%</strong></div>
                          <div><span className="block text-[10px] text-[#777486]">Infractions</span><strong className="mt-1 block font-mono text-xs text-[#e9e5f4]">≤ {request.maxViolationsAllowed}</strong></div>
                          <div><span className="block text-[10px] text-[#777486]">Leases</span><strong className="mt-1 block font-mono text-xs text-[#e9e5f4]">≥ {request.minCompletedLeasesRequired}</strong></div>
                        </div>
                      </div>

                      {request.notes && <p className="mt-4 border-l border-[#f59cf2]/45 pl-3 text-[11px] italic leading-5 text-[#aaa7b9]">“{request.notes}”</p>}
                    </div>

                    <div className="mt-5 flex flex-col gap-3 border-t border-white/[0.08] pt-4 text-[11px] sm:flex-row sm:items-center sm:justify-between">
                      <span className="text-[#777486]">Created {new Date(request.createdAt).toLocaleDateString()}</span>
                      {request.status === 'verified' ? (
                        <span className="flex items-center gap-1.5 font-semibold text-[#6ce5dd]"><CheckCircle size={14} /> Satisfied by applicant</span>
                      ) : request.status === 'rejected' ? (
                        <span className="font-semibold text-[#f4cf81]">Needs review</span>
                      ) : (
                        <Link to="/verify" className="flex items-center gap-1.5 font-semibold text-[#bf9cff] hover:text-white">Fulfill as applicant <ArrowRight size={13} /></Link>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        <section className="editorial-card bg-white/[0.035] p-5 sm:p-6" aria-labelledby="receipts-heading">
          <div className="flex flex-col gap-3 border-b border-white/[0.08] pb-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="flex items-center gap-2 text-[#6ce5dd]"><FileCheck size={16} /><span className="text-[10px] font-mono uppercase tracking-[0.14em]">Outcome archive</span></div>
              <h2 id="receipts-heading" className="mt-2 text-xl font-semibold tracking-[-0.04em] text-white">Verified applicant proofs</h2>
              <p className="mt-2 max-w-2xl text-xs leading-5 text-[#9695a9]">A verifier receives the mathematical outcome and disclosed policy thresholds—not the tenant’s address, rent amount, or source documents.</p>
            </div>
            <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#777486]">{history.length} browser-local receipts</span>
          </div>

          {history.length === 0 ? (
            <div className="py-10 text-center text-xs text-[#777486]">No applicant proof outcomes have been recorded in this browser.</div>
          ) : (
            <div className="mt-5 space-y-3">
              {history.map((item) => (
                <article key={item.id} className="rounded-xl border border-white/[0.08] bg-[#090910]/55 p-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-[#6ce5dd] shadow-[0_0_10px_#6ce5dd]" /><span className="text-sm font-semibold text-white">{item.propertyTitle ?? 'Independent verification'}</span></div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={item.result === 'verified' ? 'badge-verified text-[10px]' : 'badge-pending text-[10px]'}>{item.result === 'verified' ? 'Verified outcome' : 'Failed outcome'}</span>
                      <span className="font-mono text-[10px] text-[#777486]">{new Date(item.timestamp).toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-xl border border-[#6ce5dd]/20 bg-[#6ce5dd]/[0.045] p-3.5">
                      <div className="mb-2 flex items-center gap-1.5 text-[11px] font-semibold text-[#6ce5dd]"><Eye size={13} />Disclosed policy results</div>
                      <ul className="space-y-1.5 text-[11px] text-[#e9e5f4]">
                        {item.disclosedClaims.map((claim, index) => (
                          <li key={`${item.id}-claim-${index}`} className="flex items-start gap-1.5"><Check size={12} className="mt-0.5 shrink-0 text-[#6ce5dd]" /><span>{claim.label}: <strong className="text-[#6ce5dd]">{claim.requirement}</strong></span></li>
                        ))}
                      </ul>
                    </div>
                    <div className="rounded-xl border border-white/[0.09] bg-white/[0.025] p-3.5">
                      <div className="mb-2 flex items-center gap-1.5 text-[11px] font-semibold text-[#aaa7b9]"><EyeOff size={13} className="text-[#f59cf2]" />Shielded from verifier</div>
                      <ul className="space-y-1.5 text-[11px] text-[#9695a9]">
                        {item.protectedClaims.map((claim, index) => <li key={`${item.id}-protected-${index}`} className="flex items-start gap-1.5"><span className="font-bold text-[#f59cf2]">×</span><span>{claim}</span></li>)}
                      </ul>
                    </div>
                  </div>

                  {(item.txId || item.nullifierHex) && (
                    <div className="mt-4 flex flex-col gap-1 border-t border-white/[0.07] pt-3 font-mono text-[10px] text-[#777486] sm:flex-row sm:justify-between">
                      {item.txId && <span className="break-all">Transaction hash: {item.txId}</span>}
                      {item.nullifierHex && <span>Nullifier: {item.nullifierHex.slice(0, 16)}…</span>}
                    </div>
                  )}
                </article>
              ))}
            </div>
          )}
        </section>
      </div>

      {createModalOpen && (
        <ModalFrame title="Create verification request" onClose={() => setCreateModalOpen(false)} wide>
          <div className="space-y-1 text-xs text-[#9695a9]">
            <p>Define a minimum policy. The applicant will prove these conditions without revealing the underlying documents.</p>
            <p className="text-[#f4cf81]">This request is stored in the local browser demo until your application submits it.</p>
          </div>

          <form onSubmit={handleCreate} className="mt-6 space-y-5" aria-label="Create verification request form">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="request-property-title" className="mb-1.5 block text-xs font-medium text-[#e9e5f4]">Property name / community</label>
                <input id="request-property-title" type="text" required placeholder="e.g. Westlake Gardens" value={propertyTitle} onChange={(event) => setPropertyTitle(event.target.value)} className="w-full rounded-xl border border-white/10 bg-[#090910]/75 px-3 py-2.5 text-xs text-white outline-none placeholder:text-[#777486] focus:border-[#bf9cff]/60" />
              </div>
              <div>
                <label htmlFor="request-property-unit" className="mb-1.5 block text-xs font-medium text-[#e9e5f4]">Apartment / unit</label>
                <input id="request-property-unit" type="text" required placeholder="e.g. Unit 302" value={propertyUnit} onChange={(event) => setPropertyUnit(event.target.value)} className="w-full rounded-xl border border-white/10 bg-[#090910]/75 px-3 py-2.5 text-xs text-white outline-none placeholder:text-[#777486] focus:border-[#bf9cff]/60" />
              </div>
            </div>

            <div>
              <label htmlFor="request-verifier-name" className="mb-1.5 block text-xs font-medium text-[#e9e5f4]">Management / landlord name</label>
              <input id="request-verifier-name" type="text" required placeholder="e.g. Pinnacle Living LLC" value={verifierName} onChange={(event) => setVerifierName(event.target.value)} className="w-full rounded-xl border border-white/10 bg-[#090910]/75 px-3 py-2.5 text-xs text-white outline-none placeholder:text-[#777486] focus:border-[#bf9cff]/60" />
            </div>

            <fieldset className="rounded-xl border border-white/10 bg-white/[0.025] p-4">
              <legend className="px-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#aaa7b9]">Policy requirements</legend>
              <div className="mt-3 grid gap-4 sm:grid-cols-3">
                <div>
                  <label htmlFor="request-min-months" className="mb-1.5 block text-[11px] text-[#9695a9]">Minimum duration</label>
                  <div className="flex items-center gap-2"><input id="request-min-months" type="number" min="1" max="60" value={minMonths} onChange={(event) => setMinMonths(Number(event.target.value))} className="w-full rounded-lg border border-white/10 bg-[#090910]/75 px-2.5 py-2 font-mono text-xs text-white outline-none focus:border-[#bf9cff]/60" /><span className="text-[#777486]">mo</span></div>
                </div>
                <div>
                  <label htmlFor="request-min-score" className="mb-1.5 block text-[11px] text-[#9695a9]">Minimum payment score</label>
                  <div className="flex items-center gap-2"><input id="request-min-score" type="number" min="50" max="100" value={minScore} onChange={(event) => setMinScore(Number(event.target.value))} className="w-full rounded-lg border border-white/10 bg-[#090910]/75 px-2.5 py-2 font-mono text-xs text-white outline-none focus:border-[#bf9cff]/60" /><span className="text-[#777486]">%</span></div>
                </div>
                <div>
                  <label htmlFor="request-max-violations" className="mb-1.5 block text-[11px] text-[#9695a9]">Maximum infractions</label>
                  <input id="request-max-violations" type="number" min="0" max="3" value={maxViolations} onChange={(event) => setMaxViolations(Number(event.target.value))} className="w-full rounded-lg border border-white/10 bg-[#090910]/75 px-2.5 py-2 font-mono text-xs text-white outline-none focus:border-[#bf9cff]/60" />
                </div>
              </div>
            </fieldset>

            <div>
              <label htmlFor="request-notes" className="mb-1.5 block text-xs font-medium text-[#e9e5f4]">Additional notes for applicant <span className="text-[#777486]">(optional)</span></label>
              <textarea id="request-notes" rows={3} placeholder="e.g. Standard lease application check." value={notes} onChange={(event) => setNotes(event.target.value)} className="w-full resize-y rounded-xl border border-white/10 bg-[#090910]/75 px-3 py-2.5 text-xs text-white outline-none placeholder:text-[#777486] focus:border-[#bf9cff]/60" />
            </div>

            <div className="flex flex-col-reverse gap-2 border-t border-white/[0.08] pt-4 sm:flex-row sm:justify-end">
              <button type="button" onClick={() => setCreateModalOpen(false)} className="btn-secondary text-xs">Cancel</button>
              <button type="submit" className="btn-primary text-xs">Create request <ArrowRight size={14} /></button>
            </div>
          </form>
        </ModalFrame>
      )}
    </div>
  );
}
