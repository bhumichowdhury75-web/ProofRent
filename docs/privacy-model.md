# ProofRent Privacy Model & Disclosure Boundaries

One of the most important architectural aspects of ProofRent is that **it is not a standard Web2 database with a hidden frontend**. It utilizes Midnight's fundamental separation between private execution and public state consensus.

---

## 1. The Three Spheres of Data

```
+-------------------------------------------------------------+
|                      1. PRIVATE DATA                        |
|                  (Tenant Client Storage)                    |
|  - Physical previous address (street, unit, city, zip)      |
|  - Exact monthly rent amount paid                           |
|  - Previous landlord private phone & email                  |
|  - Unresolved dispute details & notes                       |
|  - Full lease agreement text & PDF contracts                |
|  - Secret blinding factors (credential_salt)                |
+-------------------------------------------------------------+
                              |
                     [Witness Evaluation]
                              |
                              v
+-------------------------------------------------------------+
|                       2. PROOF DATA                         |
|                 (Zero-Knowledge Arguments)                  |
|  - Proof that duration >= required threshold                |
|  - Proof that payment score >= policy threshold             |
|  - Proof that infractions <= maximum threshold              |
|  - Proof that lease concluded in good standing              |
|  - Proof that commitment is in registry and not revoked     |
+-------------------------------------------------------------+
                              |
                     [Consensus Submission]
                              |
                              v
+-------------------------------------------------------------+
|                  3. PUBLIC / VERIFIABLE DATA                |
|                    (Midnight Blockchain)                    |
|  - Credential commitments: Set<Bytes<32>>                   |
|  - Nullifiers: Set<Bytes<32>>                               |
|  - Revocations: Set<Bytes<32>>                              |
|  - Operational policy thresholds (min_months, deadline)     |
|  - Total verification counter (total_verifications)         |
+-------------------------------------------------------------+
```

---

## 2. Observer Visibility Matrix

| Attribute / Field | Stored Where? | Visible to New Landlord? | Visible to On-Chain Observer? |
|---|---|:---:|:---:|
| **Previous Home Address** | Client Witness | **NO** | **NO** |
| **Exact Monthly Rent** | Client Witness | **NO** | **NO** |
| **Full Lease Contract Document** | Client Witness | **NO** | **NO** |
| **Tenant Real Identity** | Off-Chain | **Selective** | **NO** |
| **Previous Landlord Contact Info** | Client Witness | **NO** | **NO** |
| **Credential Commitment Hash** | Ledger Set | Yes | Yes (Opaque 32-byte hash) |
| **Proof Outcome** | Transaction Result | **YES (VERIFIED)** | Yes (Boolean circuit result) |
| **Tenancy Duration Threshold Met** | Proof Circuit | **YES (e.g. >= 12 mo)** | **NO** (Exact months private) |
| **Payment Reliability Threshold Met** | Proof Circuit | **YES (e.g. >= 90%)** | **NO** (Exact score private) |
| **Nullifier Hash** | Ledger Set | Yes | Yes (Anti-replay nonce) |

---

## 3. Why Public Blockchains Fail at Rental Screening

On Ethereum, Solana, or Polygon, all contract storage (`mapping(address => RentalHistory)`) is globally readable by anyone. Storing rental records on public chains results in:
1. **Doxxing physical residences:** Anyone with a block explorer could trace the tenant's current and past home addresses.
2. **Economic profiling:** Anyone could see how much rent the tenant paid, destroying their bargaining power.
3. **Permanent surveillance:** Evictions or resolved disputes would be permanently etched on a public ledger.

Midnight solves this fundamentally:
- The **circuit** is executed in the user's browser using private witnesses.
- The **ledger** only records the mathematical guarantee that constraints were satisfied.
- The **nullifier** prevents double-submission without linking the tenant across different applications.
