import { useState, type CSSProperties, type PointerEvent } from 'react';
import { Link } from 'react-router-dom';
import { useWallet } from '../contexts/WalletContext';
import { SelectiveDisclosureDiagram } from '../components/SelectiveDisclosureDiagram';

const faqs = [
  {
    q: 'What actually leaves my private vault?',
    a: 'Only the mathematical result of a policy check and a replay-safe nullifier. Addresses, exact rent, documents, and landlord contact details stay as private witnesses in your browser vault.',
  },
  {
    q: 'Can a landlord see my exact rental history?',
    a: 'No. ProofRent is designed around selective disclosure. A verifier can learn that a requirement was met, not the underlying number, address, or document that made it true.',
  },
  {
    q: 'What is the orbital object in the interface?',
    a: 'It is a visual model of the ProofRent flow: a private credential orbiting a public commitment, with the ZK result crossing the boundary only as a yes or no signal.',
  },
  {
    q: 'Which network is this prototype using?',
    a: 'The live prototype is wired to the Midnight Preprod testnet using Compact smart contracts and the Midnight TypeScript SDK.',
  },
];

export function LandingPage() {
  const { isConnected, isConnecting, connect } = useWallet();
  const [sliderMonths, setSliderMonths] = useState(18);
  const [sliderScore, setSliderScore] = useState(98);
  const [violations, setViolations] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [pointer, setPointer] = useState({ x: 0, y: 0 });

  const isEligible = sliderMonths >= 12 && sliderScore >= 90 && violations === 0;
  const monthRange = `${((sliderMonths - 1) / 47) * 100}%`;
  const scoreRange = `${((sliderScore - 60) / 40) * 100}%`;
  const stageStyle = {
    '--tilt-x': `${pointer.x}deg`,
    '--tilt-y': `${pointer.y}deg`,
  } as CSSProperties;

  const moveStage = (event: PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width - 0.5) * 7;
    const y = ((event.clientY - rect.top) / rect.height - 0.5) * -7;
    setPointer({ x, y });
  };

  return (
    <div className="pr-landing">
      <section className="container-custom pr-hero">
        <div>
          <div className="pr-kicker">ProofRent / private rental credentials</div>
          <h1 className="pr-hero-title">
            Your history,
            <em>without the</em>
            <strong>paper trail.</strong>
          </h1>
          <p className="pr-hero-copy">
            ProofRent turns a rental history into a private, cryptographic signal. Meet a landlord&apos;s policy without exporting the intimate details behind your life.
          </p>
          <div className="pr-hero-actions">
            {isConnected ? (
              <Link to="/verify" className="btn-primary">Open your proof lab <span aria-hidden="true">↗</span></Link>
            ) : (
              <button onClick={() => connect('preprod')} disabled={isConnecting} className="btn-primary">{isConnecting ? 'Connecting…' : 'Enter the proof lab'} <span aria-hidden="true">↗</span></button>
            )}
            <a href="#signal-lab" className="btn-secondary">Explore the signal <span aria-hidden="true">↓</span></a>
          </div>
          <div className="pr-hero-note">
            <span className="pr-hero-note-mark">◈</span>
            <span><b>0</b> addresses disclosed · <b>0</b> rent amounts exported · <b>1</b> clean yes/no signal</span>
          </div>
        </div>

        <div className="pr-stage-wrap" onPointerMove={moveStage} onPointerLeave={() => setPointer({ x: 0, y: 0 })}>
          <div className="pr-stage" style={stageStyle}>
            <div className="pr-stage-glow" />
            <div className="pr-orbit pr-orbit-a" />
            <div className="pr-orbit pr-orbit-b" />
            <div className="pr-orbit pr-orbit-c" />
            <div className="pr-node pr-node-one"><strong>PRIVATE WITNESS</strong><span>stays on device</span></div>
            <div className="pr-node pr-node-two"><strong>ZK CIRCUIT</strong><span>policy → proof</span></div>
            <div className="pr-node pr-node-three"><strong>PUBLIC RESULT</strong><span>valid / nullifier</span></div>
            <div className="pr-core"><img src="/proofrent-orb.svg" alt="ProofRent orbital credential mark" /></div>
            <div className="pr-stage-readout">
              <div className="pr-readout-head"><span>proof state / live</span><b>sealed</b></div>
              <div className="pr-readout-bar"><i /></div>
            </div>
            <span className="pr-axis">X / CREDENTIAL ORBIT / 01</span>
          </div>
        </div>
      </section>

      <div className="pr-marquee">
        <div className="container-custom pr-marquee-inner">
          <div className="pr-marquee-item"><span className="pr-marquee-dot" /><b>99.9%</b> private by default</div>
          <div className="pr-marquee-item"><b>04</b> claims selectively disclosed</div>
          <div className="pr-marquee-item"><b>00</b> raw leases on-chain</div>
          <div className="pr-marquee-item"><b>∞</b> applications, one private vault</div>
        </div>
      </div>

      <section className="container-custom pr-section">
        <div className="pr-section-heading">
          <div className="pr-eyebrow">01 / a different kind of background check</div>
          <h2 className="pr-section-title">The proof is public.<br /><span>The story stays yours.</span></h2>
          <p className="pr-section-copy">Traditional applications ask for a whole archive when they only need a single answer. ProofRent separates the signal from the sensitive source.</p>
        </div>
        <div className="pr-contrast-grid">
          <article className="pr-story-card">
            <div className="pr-card-label"><i /> the old exchange</div>
            <h3>Hand over the whole story to earn one yes.</h3>
            <p>Scanned leases, street addresses, bank statements, and personal contacts become a permanent copy in someone else&apos;s system.</p>
            <div className="pr-tag-list"><span className="pr-tag">full lease.pdf</span><span className="pr-tag">$2,450 / month</span><span className="pr-tag">street address</span></div>
          </article>
          <article className="pr-story-card solution">
            <div className="pr-card-label"><i /> the ProofRent exchange</div>
            <h3>Send the answer. Keep the source in orbit.</h3>
            <p>A previous landlord anchors a credential. You choose which threshold to prove. A new landlord sees only the verified outcome.</p>
            <div className="pr-tag-list"><span className="pr-tag">12+ months ✓</span><span className="pr-tag">90%+ on-time ✓</span><span className="pr-tag">no violations ✓</span></div>
          </article>
        </div>
      </section>

      <section id="signal-lab" className="container-custom pr-section">
        <div className="pr-section-heading">
          <div className="pr-eyebrow">02 / interactive signal lab</div>
          <h2 className="pr-section-title">Tune the private data.<br /><span>Watch the public signal react.</span></h2>
          <p className="pr-section-copy">These values are your private witness data. Move them around — the verifier receives a result, never the source values.</p>
        </div>

        <div className="pr-lab">
          <div className="pr-lab-head">
            <div>
              <h3>Selective disclosure simulator</h3>
              <p>Your browser evaluates the policy locally. This is the same boundary ProofRent protects when a real proof is synthesized.</p>
            </div>
            <div className="pr-lab-status"><i /> circuit listening</div>
          </div>

          <div className="pr-lab-grid">
            <div className="pr-lab-pane">
              <div className="pr-pane-title"><span>private witness / you</span><span className="badge-private">sealed</span></div>
              <div className="pr-control">
                <div className="pr-control-line"><label htmlFor="signal-months">previous tenancy duration</label><b>{sliderMonths} months</b></div>
                <input id="signal-months" name="signal-months" aria-valuetext={`${sliderMonths} months`} type="range" className="pr-range" min="1" max="48" value={sliderMonths} onChange={(event) => setSliderMonths(Number(event.target.value))} style={{ '--range': monthRange } as CSSProperties} />
                <div className="pr-range-hint"><span>01 mo</span><span>12 mo threshold</span><span>48 mo</span></div>
              </div>
              <div className="pr-control">
                <div className="pr-control-line"><label htmlFor="signal-score">on-time payment reliability</label><b>{sliderScore}%</b></div>
                <input id="signal-score" name="signal-score" aria-valuetext={`${sliderScore} percent`} type="range" className="pr-range" min="60" max="100" value={sliderScore} onChange={(event) => setSliderScore(Number(event.target.value))} style={{ '--range': scoreRange } as CSSProperties} />
                <div className="pr-range-hint"><span>60%</span><span>90% threshold</span><span>100%</span></div>
              </div>
              <div className="pr-control">
                <div className="pr-control-line"><span>unresolved lease infractions</span><b style={{ color: violations ? 'var(--danger)' : 'var(--aqua)' }}>{violations} found</b></div>
                <div className="pr-toggle-row" role="group" aria-label="Unresolved lease infractions">
                  {[0, 1, 2].map((value) => <button key={value} className={`pr-toggle ${violations === value ? 'selected' : ''}`} aria-pressed={violations === value} onClick={() => setViolations(value)}>{value} {value === 1 ? 'issue' : 'issues'}</button>)}
                </div>
              </div>
              <div className="pr-hidden-strip"><b>shielded fields</b><br />street address · exact rent · landlord contact · lease PDF</div>
            </div>

            <div className="pr-lab-pane pr-output">
              <div className="pr-verdict">
                <div className="pr-verdict-orb">{isEligible ? 'PASS' : 'HOLD'}</div>
                <h4 aria-live="polite" aria-atomic="true">{isEligible ? 'Policy satisfied' : 'Policy needs work'}</h4>
                <p>{isEligible ? 'new landlord gets a clean yes' : 'adjust the private witness values'}</p>
              </div>
              <div className="pr-checks">
                <div className="pr-check-row"><span>duration ≥ 12 months</span><b className={sliderMonths >= 12 ? 'pass' : 'fail'}>{sliderMonths >= 12 ? '✓ SATISFIED' : '× FAILED'}</b></div>
                <div className="pr-check-row"><span>reliability ≥ 90%</span><b className={sliderScore >= 90 ? 'pass' : 'fail'}>{sliderScore >= 90 ? '✓ SATISFIED' : '× FAILED'}</b></div>
                <div className="pr-check-row"><span>infractions ≤ 0</span><b className={violations === 0 ? 'pass' : 'fail'}>{violations === 0 ? '✓ SATISFIED' : '× FAILED'}</b></div>
                <div className="pr-check-row"><span>lease completed well</span><b className="pass">✓ SATISFIED</b></div>
              </div>
            </div>
          </div>
          <div className="pr-lab-foot"><b>Zero-knowledge result:</b> the verifier can confirm the policy was met. They never learn that your history was {sliderMonths} months or {sliderScore}% on time.</div>
        </div>
      </section>

      <section className="container-custom pr-section">
        <div className="pr-section-heading">
          <div className="pr-eyebrow">03 / the protocol loop</div>
          <h2 className="pr-section-title">A small signal.<br /><span>A much safer application.</span></h2>
        </div>
        <SelectiveDisclosureDiagram />
      </section>

      <section className="container-custom pr-section pr-faq">
        <div className="pr-section-heading">
          <div className="pr-eyebrow">04 / clear answers</div>
          <h2 className="pr-section-title">No magic words.<br /><span>Just better boundaries.</span></h2>
        </div>
        <div className="pr-faq-list">
          {faqs.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div className="pr-faq-item" key={faq.q}>
                <button id={`faq-question-${index}`} className="pr-faq-button" onClick={() => setOpenFaq(isOpen ? null : index)} aria-expanded={isOpen} aria-controls={`faq-answer-${index}`}>
                  <span>{faq.q}</span><span className="pr-faq-plus">{isOpen ? '−' : '+'}</span>
                </button>
                <div id={`faq-answer-${index}`} className="pr-faq-answer" role="region" aria-labelledby={`faq-question-${index}`} hidden={!isOpen}>{faq.a}</div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="container-custom pr-cta">
        <div>
          <h3>Make your next application a clean signal.</h3>
          <p>Bring your rental history with you — not the paperwork residue.</p>
        </div>
        {isConnected ? <Link to="/verify" className="btn-primary">Generate a proof ↗</Link> : <button onClick={() => connect('preprod')} disabled={isConnecting} className="btn-primary">{isConnecting ? 'Connecting…' : 'Connect a private vault ↗'}</button>}
      </section>
    </div>
  );
}
