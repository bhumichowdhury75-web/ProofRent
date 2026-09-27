# ProofRent User Flows & Persona Walkthroughs

ProofRent implements distinct, streamlined experiences for the three primary participants in the rental verification ecosystem.

---

## 1. Tenant User Flow

```
Connect Midnight Wallet
       │
       ▼
Access Private Credential Vault
       │
       ▼
Inspect Credential Claims (Values Kept Local)
       │
       ▼
Select Verification Request (e.g. Unit 4B Application)
       │
       ▼
Review Selective Disclosure Breakdown
       │
       ▼
Synthesize Zero-Knowledge Proof (Client WASM)
       │
       ▼
Sign & Broadcast Proof Transaction (DUST Fee)
       │
       ▼
Receive Verified Receipt with On-Chain Nullifier
```

### Steps:
1. **Connect Wallet:** Tenant connects 1AM or Lace wallet on Midnight Preprod.
2. **Review Credentials:** In the **Overview / Vault**, the tenant inspects their credentials. They can toggle "Sensitive Attributes" to view their own records (street address, rent amount) knowing they remain local.
3. **Fulfill Request:** On the **Prove & Verify** page, the tenant selects an open verification request from a landlord.
4. **Inspect Disclosure Guarantee:** The UI clearly indicates what the new landlord will learn ($\ge 12$ months, $\ge 90\%$ payment score) vs what remains shielded (previous address, exact rent).
5. **Synthesize Proof:** Tenant clicks "Synthesize Proof on Midnight". The Compact WASM circuit generates the SNARK proof in ~1 second.
6. **Submit to Consensus:** The proof transaction is broadcast to Midnight Preprod RPC. Once confirmed, the receipt is stored in the tenant's verifiable history.

---

## 2. Previous Landlord (Issuer) User Flow

```
Connect Landlord Wallet
       │
       ▼
Open "Issue Credential" Portal
       │
       ▼
Input Tenant Public Key & Tenancy Metrics
  - Tenancy Duration (months)
  - On-Time Rent Score (%)
  - Unresolved Violations
  - Lease Completed Status
       │
       ▼
Generate Cryptographic Commitment Hash
       │
       ▼
Register Commitment on Midnight On-Chain Registry
```

### Steps:
1. **Authentication:** The previous landlord connects their wallet.
2. **Input Tenancy Record:** Enters the tenant's public address and verified metrics (e.g., 18 months, 98% on-time, 0 infractions).
3. **Commitment Derivation:** The application calls the pure Compact circuit `credentialCommitment(tenant_id, salt)`.
4. **Registration:** The commitment is submitted to the on-chain `credential_registry`.
5. **Revocation (Optional):** If a breach is discovered prior to expiration, the landlord can call `revoke_credential(commitment)` using their authority key.

---

## 3. Prospective Landlord / Verifier User Flow

```
Open "Landlord Requests" Portal
       │
       ▼
Create New Verification Request
  - Property & Unit Name
  - Minimum Tenancy Requirement (e.g. >= 12 mo)
  - Minimum Payment Score (e.g. >= 90%)
  - Maximum Violations Allowed (0)
       │
       ▼
Publish Request to Tenant
       │
       ▼
Receive Verified Receipt
       │
       ▼
Inspect VERIFIED Status & Disclosed Claims Only
```

### Steps:
1. **Define Screening Criteria:** The verifier creates a request specifying minimum requirements (e.g. Unit 504: $\ge 12$ months, $\ge 90\%$ on-time payment score, 0 infractions).
2. **Applicant Submission:** The tenant completes the zero-knowledge verification flow.
3. **Read Receipt:** The verifier checks the receipt on the dashboard. They see:
   - **`Status: VERIFIED BY CONSENSUS`**
   - **`Tenancy Duration: >= 12 Months [SATISFIED]`**
   - **`Payment Reliability: >= 90% [SATISFIED]`**
   - **`Lease Breaches: 0 [SATISFIED]`**
   - **`Transaction Hash & Nullifier`**
4. **Zero-Invasion Decision:** The landlord approves the tenant with mathematical confidence while respecting the tenant's fundamental privacy rights.
