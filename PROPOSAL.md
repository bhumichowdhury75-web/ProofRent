# ProofRent — Product Idea Proposal & Architecture Roadmap

This document outlines the product foundation, zero-knowledge architecture, and future expansion proposals for **ProofRent**, a privacy-first rental verification protocol built on the **Midnight Network**.

---

## 1. Product Idea Proposal

### The Problem
Today, residential rental applications force prospective tenants to upload unencrypted, highly sensitive personal and financial documents (tax filings, bank statements, past lease agreements, complete paystubs, and prior landlord contact details) to centralized property management portals and screening bureaus.

These centralized databases represent high-value honeypots for data breaches, resulting in severe identity theft, unwanted data brokering, and persistent tenant blacklisting based on out-of-context historical disputes.

### The Solution
ProofRent uses Zero-Knowledge Proofs (ZKPs) engineered on the **Midnight Network** utilizing the **Compact** smart contract language to let tenants prove they satisfy stringent leasing requirements (such as minimum tenancy tenure, on-time payment reliability score, and zero unresolved lease violations) without exposing the underlying confidential data to landlords, screening agencies, or the public blockchain ledger.

### How It Works
1. **On-Chain Policy Registration:** A landlord or leasing agency sets verification criteria directly on the Midnight blockchain (e.g., minimum tenancy duration $\ge 12$ months, reliability score $\ge 90$, and zero violations).
2. **Private Witness Input:** The tenant enters their private credential witness locally into their browser wallet (1AM / Lace).
3. **Client-Side Proof Generation:** The tenant's local wallet runs a localized Zero-Knowledge circuit. It validates that the private witness satisfies the public policy constraints.
4. **On-Chain Attestation:** Only the mathematical proof and a deterministic, replay-safe nullifier (not the underlying raw data) are submitted to the Midnight network.
5. **Replay & Fraud Prevention:** The nullifier prevents the same credential from being double-spent or submitted under conflicting identities.

### Target Users
- **Residential Tenants & Relocators:** Apartment hunters, cross-state movers, and students seeking lease approvals without surrendering private dossiers.
- **Property Management Companies & Landlords:** Leasing agents wanting automated, tamper-proof compliance signals without the liability of storing sensitive personal data.
- **University Housing Offices & Student Co-ops:** Academic residential coordinators issuing track-record attestations for graduating students.

### Business Model
- **B2B SaaS Verification Fee:** Property managers and enterprise screening platforms pay nominal micro-fees per verification query.
- **Open-Source Protocol with Enterprise APIs:** Core Compact circuits and contract logic are free and open-source on Midnight; commercial API gateways offer turnkey integration into Yardi, RealPage, and AppFolio.

### Architectural Reference & Lineage (zkScholar)
ProofRent's privacy model, contract-witness interaction patterns, and zero-knowledge selective disclosure architecture directly reference and build upon the foundational design patterns established in the **[zkScholar](https://github.com/Aman-Raj-bat/zkScholar)** project on the Midnight Network.

- **Conceptual Foundation:** **zkScholar** pioneered privacy-preserving student eligibility gating on Midnight by demonstrating that sensitive multi-attribute qualifications (such as GPA thresholds and family income maximums) can be proven client-side with zero disclosure of raw values to grant committees or the public ledger.
- **Domain Adaptation & Expansion:** ProofRent adapts the core zero-knowledge circuit patterns from **zkScholar** into the residential leasing ecosystem. While zkScholar handled academic evaluation criteria, ProofRent introduces:
  - Multi-variable tenancy evaluation (`months_rented`, `payment_reliability_score`, `unresolved_violations`).
  - Landlord credential attestation commitments and state-backed issuer signatures.
  - Granular policy updates and dynamic compliance checking on the Midnight Preprod network.
  - Replay-safe nullifiers to guarantee non-repudiation and prevent credential recycling across concurrent rental bids.

By leveraging the architectural insights of **zkScholar**, ProofRent establishes a proven, high-reliability design pattern for privacy-first attestation platforms across diverse real-world verticals on Midnight.

### Level 3 Milestone Submission
ProofRent is deployed on the **Midnight Preprod Network** (`mn_addr_preprod1fjw64hh5veuayhl782sxggpq8jfp0vq0zvv3cvz94nv7cnzu9clqp3zk9e`) and fully verified end-to-end:
- **Compact Smart Contract:** `contracts/proofrent.compact` compiled into WASM, ZKIR, and BZKIR proving keys.
- **Automated Test Coverage:** 23 assertions in Vitest covering all valid, boundary, and edge-case execution paths.
- **Production Web Application:** Live on Vercel ([https://proof-rent-zeta.vercel.app/](https://proof-rent-zeta.vercel.app/)) interfacing with 1AM and Lace wallets.

---

## 2. Future Proposals & Architecture Roadmap

## Proposal 1: Portable Rental Credentials Across Jurisdictions

### Problem
Tenants moving across states or internationally face friction because rental screening services are siloed and jurisdiction-specific. Traditional references require landlords to call previous landlords, risking timezone mismatches, language barriers, and data leakage.

### Proposed Solution
Establish an open, standardized W3C-compatible Verifiable Credential schema for rental track records that can be recognized and proven across property management software, independent landlords, and jurisdictional borders.

### Privacy Implications
The tenant carries their credential in their private Midnight wallet. No centralized registry or credit bureau tracks cross-border mobility. The credential can be verified anywhere without revealing physical residency history.

### Potential Midnight Implementation
- Standardize the `RentalCredential` struct encoding format across regional registries.
- Utilize Midnight multi-region indexer feeds and unshielded coin public key bindings so any landlord wallet can authenticate the issuing authority.

### Future Scope
Enable immigrant and international worker rental onboarding without requiring local domestic credit scores.

---

## Proposal 2: Multi-Property Aggregated Verification

### Problem
Tenants who lived in multiple properties over a multi-year period (e.g., two 12-month leases in different cities) currently have to provide multiple disparate reference letters or separate proof disclosures.

### Proposed Solution
Allow a tenant to generate a single aggregate Zero-Knowledge proof over a collection of credentials, proving cumulative tenancy duration (e.g., cumulative tenancy $\ge$ 24 months) and average on-time payment reliability ($\ge$ 95%) without revealing how many properties were rented or where they were located.

### Privacy Implications
The verifier only sees that the tenant has accumulated the required total tenancy across multiple residences. The count of moves, specific landlords, and intermediate gaps remain confidential.

### Potential Midnight Implementation
- Extend Compact circuits with recursive Merkle accumulators or vector witness iteration.
- Circuit checks valid commitments for $N$ credentials in `credential_registry` and verifies $\sum \text{months}_i \ge \text{target\_months}$.

### Future Scope
Enterprise leasing for corporate relocations and military family housing transitions.

---

## Proposal 3: Dynamic Credential Revocation & Expiring Attestations

### Problem
If a tenant causes severe property damage after a credential was preliminarily issued, or if a lease was terminated for cause, a landlord needs the ability to invalidate the credential without publicizing defamatory information.

### Proposed Solution
Implement a privacy-preserving revocation accumulator. Revocations are registered as cryptographic hashes on-chain. When a tenant proves their history, the Compact circuit checks non-membership in the revocation set in zero knowledge.

### Privacy Implications
An observer looking at the revocation registry only sees arbitrary 32-byte hashes (`revoked_credentials`). Neither the tenant identity nor the reason for revocation is ever disclosed.

### Potential Midnight Implementation
- Already pioneered in ProofRent v1 via `revoked_credentials: Set<Bytes<32>>`.
- Future version: transition to cryptographic dynamic cryptographic accumulators (e.g. Merkle Mountain Ranges or RSA accumulators) for constant-time on-chain membership proofs.

### Future Scope
Time-decayed revocation where minor late payment infractions automatically expire after 24 months.

---

## Proposal 4: Privacy-Preserving Rent-to-Income Affordability Proofs

### Problem
Landlords frequently require that an applicant's gross monthly income is at least 3x the monthly rent. Tenants currently have to hand over tax returns, W-2 forms, and complete paystubs, exposing full salary numbers, employers, and family financial circumstances.

### Proposed Solution
Allow a payroll provider or financial institution to issue an income credential. The tenant can then generate a zero-knowledge comparison proof:
$$\text{Income Witness} \ge 3 \times \text{Public Target Rent}$$
without disclosing the exact salary, employer, or bonus structures.

### Privacy Implications
The landlord learns strictly that the applicant earns at least $3\times$ the rent. If the rent is $2,000/mo, they know the tenant earns $\ge \$6,000/\text{mo}$, but cannot tell if they earn $\$7,000$ or $\$250,000$.

### Potential Midnight Implementation
- Implement a secondary Compact circuit `verify_affordability(target_rent: Uint32)` taking private witness `monthly_income: Uint32`.
- Zero-knowledge assertion: `assert(monthly_income >= target_rent * 3)`.

### Future Scope
Combined lease qualification where a single proof verifies both 12+ months past rental tenure AND $3\times$ income affordability in one atomic transaction.

---

## Proposal 5: Institutional Property-Manager & Verified Issuer Federation

### Problem
Anyone can generate a fake signature if public keys of verified property management companies are not discoverable. Conversely, a centralized registry of landlords creates a monopoly directory.

### Proposed Solution
A decentralized issuer directory where real estate licensing boards, municipal housing authorities, and recognized property management associations publish cryptographic issuer certificates on Midnight.

### Privacy Implications
Issuers are publicly known institutions (e.g. "Licensed California Property Manager #88219"), while the tenants they issue credentials to remain completely anonymous.

### Potential Midnight Implementation
- Store issuer public keys in a federated on-chain Set: `export ledger approved_issuers: Set<Bytes<32>>`.
- In the circuit, verify that the credential's `issuer_pk` is a member of `approved_issuers`.

### Future Scope
Integration with Yardi, RealPage, and AppFolio property management APIs for automated zero-knowledge credential issuance upon lease checkout.

---

## Proposal 6: Student Housing & First-Time Renter Bootstrap Credentials

### Problem
First-time renters and university graduates often have zero rental history, leading landlords to demand predatory cosigners or oversized security deposits.

### Proposed Solution
Allow university housing departments, student co-ops, and dormitory coordinators to issue "On-Campus Tenancy & Conduct Credentials." A graduating student can prove 2 to 4 years of successful community living and zero disciplinary violations.

### Privacy Implications
The student's grades, academic discipline, and specific dormitory room number are not revealed; only compliance and tenure duration are verified.

### Potential Midnight Implementation
- Domain-specific Compact circuit `verify_student_coop_standing()` evaluating on-campus residence longevity.

### Future Scope
Partnerships with university housing portals to bootstrap young adults into independent housing.

---

## Proposal 7: Dispute Handling & Blinded Arbitration

### Problem
If a landlord refuses to issue a credential out of bad faith or retaliation, or if a tenant disputes an infraction, there is no decentralized way to resolve the conflict without litigation.

### Proposed Solution
Blinded cryptographic escrow: An independent tenant-landlord arbitration board can evaluate encrypted lease logs and issue a binding neutral credential if the landlord acted arbitrarily.

### Privacy Implications
Evidence is shared via threshold encryption to designated mediators, keeping public arbitration records off search engines and background-check scraper sites.

### Potential Midnight Implementation
- Use Midnight shielded encryption public keys (`getEncryptionPublicKey()`) to encrypt dispute evidence for a selected arbitrator's key.

### Future Scope
Decentralized community mediation protocols for municipal tenant protection unions.

---

## Proposal 8: Reputation Without Public Profiling

### Problem
Traditional Web2 reputation systems create public scoreboards (e.g., social credit, public ratings) where individuals are indexed and subject to discrimination or data profiling.

### Proposed Solution
ProofRent maintains a strictly zero-knowledge model of reputation: there is no public leaderboard, no public ranking, and no searchable database of tenants. Reputation exists only in the tenant's wallet and is disclosed only when a specific landlord asks a specific threshold question.

### Privacy Implications
Total protection against data brokers, background-check scraping farms, and tenant blacklists.

### Potential Midnight Implementation
- Maintain zero public mapping of tenant identity $\leftrightarrow$ credentials on the Midnight ledger.
- Use unpredictable nullifier domain salts to ensure proofs submitted to Landlord A cannot be linked to proofs submitted to Landlord B.

---

## Summary of Proposals

| Proposal | Objective | Primary Privacy Benefit | Midnight Component |
|---|---|---|---|
| **P1: Cross-Jurisdiction Portability** | Global moving without references | Zero geographic profiling | Inter-network unshielded coin PKs |
| **P2: Multi-Property Aggregation** | Prove cumulative years across moves | Hides move counts & addresses | Vector witness loop circuits |
| **P3: Dynamic Revocation** | Invalidate breached credentials | Anonymous revocation hashes | `revoked_credentials` Set |
| **P4: Affordability Proofs** | Prove $\ge 3\times$ income threshold | Conceals exact salary & paystubs | Threshold comparison circuits |
| **P5: Institutional Federation** | Verified property manager registry | Tenant stays private, issuer verified | `approved_issuers` ledger set |
| **P6: Student Housing Bootstrap** | First-time renter track records | Hides academic records & grades | Campus housing witness schemas |
| **P7: Blinded Arbitration** | Neutral dispute resolution | Encrypted mediation channel | Shielded encryption keys |
| **P8: Zero Public Profiling** | Eliminate tenant blacklists | No public database of tenants | Anti-correlation nullifier hashing |
