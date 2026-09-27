# ProofRent — Future Proposals & Architecture Roadmap

This document outlines the strategic product and cryptographic expansion proposals for **ProofRent**, a privacy-first rental verification platform built on the Midnight Network.

---

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
- Future version: transition to cryptographic cryptographic dynamic cryptographic accumulators (e.g. Merkle Mountain Ranges or RSA accumulators) for constant-time on-chain membership proofs.

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
