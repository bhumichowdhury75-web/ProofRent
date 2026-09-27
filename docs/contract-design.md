# ProofRent Compact Smart Contract Architecture

The smart contract for ProofRent is implemented in **Compact**, Midnight's domain-specific language for zero-knowledge smart contracts.

The source file is located at `contracts/proofrent.compact`.

---

## 1. Rationale for Ledger State (Public On-Chain Data)

Every public ledger variable has a deliberate purpose and cannot be eliminated without compromising protocol correctness:

```compact
export ledger min_tenancy_months: Uint<32>;
export ledger min_payment_score: Uint<32>;
export ledger max_violations: Uint<32>;
export ledger min_completed_leases: Uint<32>;
export ledger admin: Bytes<32>;
export ledger is_active: Boolean;
export ledger total_verifications: Uint<32>;
export ledger total_credentials: Uint<32>;
export ledger deadline: Uint<64>;
export ledger credential_registry: Set<Bytes<32>>;
export ledger revoked_credentials: Set<Bytes<32>>;
export ledger nullifiers: Set<Bytes<32>>;
```

### Why each element is public:
1. **`credential_registry`**: Stores 32-byte hashes of valid credentials issued by landlords. This allows the circuit to assert that a tenant holds a real credential without revealing what that credential contains.
2. **`revoked_credentials`**: Stores invalidated commitments. When a credential is revoked, its hash is recorded here so the ZK circuit rejects subsequent proofs.
3. **`nullifiers`**: Prevents the same credential from being used to generate multiple redundant proofs within a single scope.
4. **`min_tenancy_months`, `min_payment_score`, `max_violations`**: Public baseline policy parameters configured by protocol governance.
5. **`admin`**: Stores the persistent hash of the authority secret key, enabling decentralized authentication without revealing private keys.
6. **`total_verifications`, `total_credentials`**: Monotonically increasing counters used for protocol metrics and telemetry.

---

## 2. Rationale for Private Witnesses (Never Revealed On-Chain)

```compact
struct RentalCredential {
    tenant_id: Bytes<32>,          // Private tenant identifier / coin public key
    tenancy_months: Uint<32>,      // Duration of completed tenancy in months
    payment_score: Uint<32>,       // On-time rental payment reliability score (0-100)
    violations: Uint<32>,          // Number of unresolved lease infractions
    completed_leases: Uint<32>,    // Total successful leases completed
    lease_completed: Boolean,      // Whether lease concluded in good standing
    credential_salt: Bytes<32>     // Blinding factor ensuring commitment uniqueness
}

witness rental_credential(): RentalCredential;
witness admin_secret_key(): Bytes<32>;
```

### Why each element is private:
- **`tenancy_months`**: Revealed only as an inequality ($\ge \text{threshold}$). A landlord requiring 12 months never learns whether the tenant lived there for 13 months or 7 years.
- **`payment_score`**: Proves reliability ($\ge 90\%$) without exposing private banking records or payment receipts.
- **`violations`**: Proves absence of lease breaches ($\le 0$) without disclosing landlord dispute logs.
- **`credential_salt`**: Cryptographic entropy preventing rainbow-table attacks or brute-force preimage searching on the credential commitment.

---

## 3. Circuit Analysis

### 3.1 `verify_rental_history()`
The core verification circuit:
1. Asserts `is_active` and `blockTimeLt(deadline)`.
2. Reads private witness `rental_credential()`.
3. Computes `commitment = credentialCommitment(creds.tenant_id, creds.credential_salt)`.
4. Asserts that `credential_registry.member(commitment)` is true.
5. Asserts that `!revoked_credentials.member(commitment)` is true.
6. Asserts all private eligibility criteria:
   - `assert(creds.lease_completed)`
   - `assert(creds.tenancy_months >= min_tenancy_months)`
   - `assert(creds.payment_score >= min_payment_score)`
   - `assert(creds.violations <= max_violations)`
7. Derives deterministic nullifier: `nul = makeNullifier(creds.tenant_id, commitment)`.
8. Asserts `!nullifiers.member(nul)` and inserts `nul`.
9. Increments `total_verifications = disclose((total_verifications + 1) as Uint<32>)`.

### 3.2 `issue_credential(commitment: Bytes<32>)`
Invoked by landlords to register credential commitments. Ensures uniqueness with `!credential_registry.member(commitment)`.

### 3.3 `revoke_credential(commitment: Bytes<32>)`
Invoked with `admin_secret_key()` to insert an invalidated credential into `revoked_credentials`.

---

## 4. Arithmetic Type Widening Prevention

In Compact, any arithmetic operation (`+`, `-`, `*`) automatically widens integer types (e.g. `Uint<32>` + `1` becomes `Uint<0..4294967297>`). ProofRent explicitly casts all arithmetic results:
```compact
total_verifications = disclose((total_verifications + 1) as Uint<32>);
total_credentials = disclose((total_credentials + 1) as Uint<32>);
```
This guarantees strict compatibility with Compact 0.31.0 and 0.5.2 toolchains.
