import { NETWORK_CONFIGS } from '../config';

export function Footer() {
  return (
    <footer className="pr-footer">
      <div className="container-custom">
        <div className="pr-footer-grid">
          <div>
            <div className="pr-brand">
              <img src="/proofrent-orb.svg" alt="ProofRent orbital key" />
              <span className="pr-brand-copy">
                <span className="pr-brand-name">ProofRent</span>
                <span className="pr-brand-sub">private rental protocol</span>
              </span>
            </div>
            <p className="pr-footer-copy">
              A private signal for the rental market. Prove a trustworthy history without handing over the coordinates of your past.
            </p>
          </div>

          <div>
            <div className="pr-footer-heading">Privacy architecture</div>
            <div className="pr-footer-list">
              <span>Zero-knowledge proofs</span>
              <span>Selective disclosure</span>
              <span>Client-side witnesses</span>
              <span>Replay-safe nullifiers</span>
            </div>
          </div>

          <div>
            <div className="pr-footer-heading">Network links</div>
            <div className="pr-footer-list">
              <a href="https://docs.midnight.network" target="_blank" rel="noopener noreferrer">Midnight docs ↗</a>
              <a href={NETWORK_CONFIGS.preprod.faucet} target="_blank" rel="noopener noreferrer">Preprod faucet ↗</a>
              <a href={NETWORK_CONFIGS.preprod.explorer} target="_blank" rel="noopener noreferrer">Explorer ↗</a>
            </div>
          </div>
        </div>

        <div className="pr-footer-bottom">
          <span className="pr-footer-secure"><i /> built on Midnight preprod</span>
          <span>PROOFRENT / CREDENTIAL LAYER 01 / 2025</span>
        </div>
      </div>
    </footer>
  );
}
