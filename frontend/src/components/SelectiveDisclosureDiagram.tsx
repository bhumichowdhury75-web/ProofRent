export function SelectiveDisclosureDiagram() {
  const steps = [
    { number: '01', mark: '↗', title: 'Anchor the credential', body: 'A previous landlord issues a signed rental credential and registers only its cryptographic commitment.', tone: 'soft' },
    { number: '02', mark: '◈', title: 'Keep the witness private', body: 'Your browser vault holds the address, rent, and lease details. They become private inputs to the circuit.', tone: 'bright' },
    { number: '03', mark: '→', title: 'Send the clean signal', body: 'A new landlord verifies the exact policy outcome and a replay-safe receipt — never the source data.', tone: 'soft' },
  ];

  return (
    <div className="pr-flow" aria-label="ProofRent protocol flow">
      {steps.map((step, index) => (
        <article className={`pr-flow-card ${step.tone}`} key={step.number}>
          <div className="pr-flow-number">NODE / {step.number}</div>
          <div className="pr-flow-mark">{step.mark}</div>
          <h3>{step.title}</h3>
          <p>{step.body}</p>
          {index < steps.length - 1 && <span className="pr-flow-connector" aria-hidden="true" />}
        </article>
      ))}
    </div>
  );
}
