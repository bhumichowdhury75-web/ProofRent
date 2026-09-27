# ProofRent Threat Model & Security Boundaries

This document defines the security model, trust assumptions, threat vectors, and architectural mitigations implemented in **ProofRent**.

---

## 1. Security Objectives

1. **Confidentiality:** Prevent prospective landlords, network observers, and indexers from discovering tenant home addresses, exact rent amounts, and full lease documents.
2. **Soundness:** Guarantee that an applicant cannot produce an accepted proof without possessing a valid, unrevoked credential satisfying all policy thresholds.
3. **Replay Resistance:** Prevent an applicant from reusing a single credential proof across multiple unauthorized contexts.
4. **Authority Integrity:** Ensure that only authorized administrative keys can execute credential revocations and policy modifications.

---

## 2. Threat Vectors and Mitigations

### 2.1 Threat: Credential Forgery (Fabricated Tenancy History)
- **Vector:** An applicant invents fake values (e.g. 36 months, 100% on-time score) and attempts to submit a proof.
- **Mitigation:** The `verify_rental_history` circuit requires proof of membership in `credential_registry`. The commitment hash `H(tenant_id, salt)` must have been registered on-chain by the issuing landlord. Unregistered preimages cause the ZK proof generation to fail constraint satisfaction.

### 2.2 Threat: Replay Attack (Double Verification)
- **Vector:** An applicant extracts a proof generated for Landlord A and attempts to present it to Landlord B.
- **Mitigation:** The circuit derives a deterministic nullifier `makeNullifier(tenant_id, commitment)`. Once submitted, the nullifier is added to `nullifiers: Set<Bytes<32>>`. Any subsequent verification using the same nullifier is rejected by the contract.

### 2.3 Threat: Preimage Recovery / Brute-Force Attacks
- **Vector:** An adversary attempts to brute force the commitment hash on-chain to discover the tenant's identity.
- **Mitigation:** The commitment includes a 256-bit cryptographically secure pseudorandom blinding factor (`credential_salt`). With 256 bits of entropy, rainbow tables and preimage attacks are computationally infeasible ($2^{256}$ operations).

### 2.4 Threat: Unauthorized Revocation
- **Vector:** A malicious third party attempts to revoke a legitimate tenant's credential.
- **Mitigation:** The `revoke_credential` circuit verifies `admin == adminPublicKey(sk)`. Only possession of the private authority secret key permits adding hashes to `revoked_credentials`.

### 2.5 Threat: Outdated / Expired Verification Cycles
- **Vector:** An applicant attempts to submit an old proof after the landlord's screening deadline has elapsed.
- **Mitigation:** The circuit enforces `blockTimeLt(deadline)` against Midnight's consensus block time.

---

## 3. Trust Assumptions & Boundaries

| Component | Trust Level | Failure Impact |
|---|---|---|
| **Midnight Consensus** | Decentralized Trust | Transaction ordering and ledger integrity |
| **ZK Prover WASM** | Untrusted Client Execution | Proof fails locally if false; cannot lie to ledger |
| **Issuing Landlord** | Attestation Authority | Responsible for truthfulness of issued tenancy records |
| **Prospective Landlord** | Verifier | Cannot extract private records from valid proofs |
