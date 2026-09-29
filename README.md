# ProofRent

[![CI](https://github.com/ProofRent/ProofRent/actions/workflows/ci.yaml/badge.svg)](https://github.com/ProofRent/ProofRent/actions/workflows/ci.yaml)

> **"Prove your rental history. Keep your history private."**

ProofRent is a privacy-first rental verification platform built on the **Midnight Network**. It enables tenants to receive cryptographic rental credentials from previous landlords and selectively prove verified facts (tenancy duration, on-time payment reliability, lease completion) to new landlords **WITHOUT** revealing sensitive personal data like previous street addresses, exact rent amounts, or complete lease contracts.

---

## 1. Project Overview

When moving to a new home, tenants routinely encounter predatory screening practices. Prospective landlords demand proof of responsible past tenure, forcing applicants to hand over unredacted lease agreements, bank statements, tax forms, and previous landlord contact information.

ProofRent replaces invasive manual screening with **Zero-Knowledge selective disclosure**:
- Previous landlords issue tamper-proof rental credentials.
- Tenants store credentials privately in their client-side browser vault.
- Tenants synthesize zero-knowledge SNARK proofs satisfying a new landlord's specific policy.
- Prospective landlords receive cryptographic verification (**VERIFIED**) without learning any underlying private information.

---

## 2. The Problem

Traditional rental verification suffers from fundamental privacy and security flaws:
1. **Doxxing Physical Residences:** Tenants must expose every physical apartment and street they previously resided at.
2. **Loss of Financial Leverage:** Landlords see exact monthly rents paid in the past, weakening the tenant's negotiating position.
3. **Identity Theft & Data Breaches:** Unencrypted rental documents sit indefinitely on centralized property management servers.
4. **Discriminatory Profiling:** Sensitive personal details unrelated to tenancy reliability are routinely exposed during screening.

---

## 3. The Solution

ProofRent introduces **Private Rental Reputation**:
- **Zero-Knowledge Assertions:** Prove $\text{Duration} \ge 12\text{ months}$ and $\text{Payment Score} \ge 90\%$ without disclosing actual values.
- **Selective Disclosure:** Disclose only the mathematical answer to the landlord's screening question.
- **Client-Side Proof Generation:** Private witnesses never leave the tenant's browser memory.
- **Cryptographic Nullifiers:** Prevent identity duplication and proof replay across landlords.

---

## 4. Why Midnight Network?

Public blockchains (like Ethereum or Solana) store all contract state openly. Storing rental records on a public blockchain would create a permanent, public registry of where people live and what they pay in rent.

Midnight is purpose-built for data protection:
- **Compact Language:** Allows expressive constraints over private witnesses and public ledger state.
- **ZK Prover WASM:** Generates SNARK arguments client-side in the browser.
- **Dual State Architecture:** Separates private execution from public consensus verification.
- **Deterministic Nullifiers:** Provides unforgeable double-spend and anti-replay protection.

---

## 5. Privacy Model & Disclosure Matrix

| Data Field | Handled As | Disclosed to New Landlord? | Visible on Midnight Ledger? |
|---|---|:---:|:---:|
| **Previous Home Address** | Private Witness | **NO** (Shielded) | **NO** |
| **Exact Monthly Rent** | Private Witness | **NO** (Shielded) | **NO** |
| **Previous Landlord Contact** | Private Witness | **NO** (Shielded) | **NO** |
| **Full Lease Contract PDF** | Private Witness | **NO** (Shielded) | **NO** |
| **Tenancy Duration Requirement Met** | ZK Circuit Assertion | **YES** (e.g. $\ge 12$ mo) | No (Evaluated in ZK) |
| **Payment Reliability Met** | ZK Circuit Assertion | **YES** (e.g. $\ge 90\%$) | No (Evaluated in ZK) |
| **No Unresolved Infractions** | ZK Circuit Assertion | **YES** (0 infractions) | No (Evaluated in ZK) |
| **Credential Commitment** | Ledger Set | Opaque Hash | **YES** (32-byte hash) |
| **Proof Outcome** | Transaction Result | **YES (VERIFIED)** | **YES** |
| **Anti-Replay Nullifier** | Ledger Set | Opaque Hash | **YES** (32-byte hash) |

---

## 6. System Architecture

```
+-------------------------------------------------------------+
|                      1. PREVIOUS LANDLORD                   |
|  - Inputs tenancy duration, on-time score, lease standing    |
|  - Generates cryptographic commitment: H(TenantID, Salt)     |
|  - Submits commitment to on-chain registry                   |
+-------------------------------------------------------------+
                              |
                     [Issues Credential]
                              |
                              v
+-------------------------------------------------------------+
|                     2. TENANT PRIVATE VAULT                 |
|  - Stores credential witness locally in browser memory       |
|  - Evaluates verifier request criteria                      |
|  - Generates ZK proof using Compact WASM circuit             |
+-------------------------------------------------------------+
                              |
                     [Submits ZK Proof]
                              |
                              v
+-------------------------------------------------------------+
|                  3. MIDNIGHT SMART CONTRACT                 |
|  - Validates proof of commitment in credential_registry      |
|  - Checks credential is NOT in revoked_credentials          |
|  - Asserts duration, score, and zero-violation constraints   |
|  - Records nullifier to prevent replay                      |
+-------------------------------------------------------------+
                              |
                     [Verified Consensus]
                              |
                              v
+-------------------------------------------------------------+
|                    4. PROSPECTIVE LANDLORD                  |
|  - Learns: All criteria satisfied (VERIFIED)                |
|  - Learns NOTHING about previous address or exact rent      |
+-------------------------------------------------------------+
```

---

## 7. User Flows

### 1. Tenant
- Connects Midnight wallet (1AM, Lace, or Nightly).
- Views credentials stored in private vault.
- Selects an open verification request from a prospective landlord.
- Reviews the **Selective Disclosure Guarantee** (shows what is proved vs what stays private).
- Synthesizes ZK proof and broadcasts transaction to Midnight Preprod.
- Receives verifiable cryptographic receipt.

### 2. Previous Landlord (Issuer)
- Connects wallet to **Issue Credential** portal.
- Enters tenant address/coin PK, tenancy duration, payment score, and lease completion status.
- Compact pure circuit computes `credentialCommitment(tenant_id, salt)`.
- Registers commitment on-chain; gives the private credential to the tenant.

### 3. New Landlord (Verifier)
- Creates screening request (e.g. Unit 4B: Min 12 months, min 90% payment score, 0 infractions).
- Receives tenant's verified proof receipt.
- Sees **VERIFIED** status and boolean claim criteria, never the underlying address or rent.

---

## 8. Smart Contract Architecture

The contract is written in Compact (`contracts/proofrent.compact`) and compiled with Compact compiler:

### Key Circuits:
- **`verify_rental_history()`**: Core ZK circuit verifying duration, payment score, violations, commitment existence, and nullifier uniqueness.
- **`issue_credential(commitment: Bytes<32>)`**: Inserts a new credential commitment hash into `credential_registry`.
- **`revoke_credential(commitment: Bytes<32>)`**: Adds an invalidated commitment to `revoked_credentials` using admin authority.
- **`update_policy(...)`**: Allows governance to update default criteria and deadlines.

### Pure Circuits:
- **`adminPublicKey(sk: Bytes<32>)`**: Deterministic SHA-based public key derivation with domain separator `proofrent:admin:v1`.
- **`credentialCommitment(tenant_id: Bytes<32>, salt: Bytes<32>)`**: 256-bit commitment calculation with domain separator `proofrent:cred:v1`.
- **`makeNullifier(tenant_id: Bytes<32>, commitment: Bytes<32>)`**: Anti-replay nullifier derivation with domain separator `proofrent:nullifier:v1`.

---

## 9. Technology Stack

- **Smart Contract Language:** Compact (`0.31.0` / `0.5.2`)
- **Blockchain Network:** Midnight Network (Preprod Testnet, Preview, Local)
- **Midnight SDK:** `@midnight-ntwrk/midnight-js-contracts`, `@midnight-ntwrk/compact-runtime`, `@midnight-ntwrk/ledger-v8`
- **Frontend Framework:** React 19, TypeScript 5.7, Vite 6
- **Styling:** Tailwind CSS (Curated editorial dark mode, zero AI gradients)
- **Testing:** Vitest 3, TypeScript typechecking
- **CI/CD:** GitHub Actions with `setup-compact-action`

---

## 10. Local Setup & Installation

### Prerequisites
- **Node.js:** $\ge$ 22.0.0
- **Yarn:** 1.22.22
- **Docker Desktop:** Latest (for local testnet / proof-server)
- **Compact Compiler:** 0.31.0 (or 0.5.2)

### Clone & Install
```bash
# Clone the repository
git clone https://github.com/ProofRent/ProofRent.git
cd ProofRent

# Install root dependencies
yarn install --ignore-engines

# Install frontend dependencies
cd frontend && yarn install --ignore-engines && cd ..
```

---

## 11. Environment Variables

Create `.env.preprod` in the project root based on `.env.preprod.example`:

```bash
cp .env.preprod.example .env.preprod
```

```ini
MIDNIGHT_NETWORK=preprod
MIDNIGHT_PREPROD_MNEMONIC=twelve or twenty four word wallet mnemonic phrase goes here
MIDNIGHT_PROOF_SERVER=http://127.0.0.1:6300
VITE_PREPROD_CONTRACT_ADDRESS=your_deployed_contract_address_here
```

> **Security Note:** Never commit `.env.preprod` or wallet mnemonics to version control.

---

## 12. Wallet Setup (1AM / Lace)

1. Install **1AM Wallet** or **Midnight Lace** extension in Chrome / Brave.
2. Create or import your wallet account.
3. Switch wallet network to **Preprod**.
4. Obtain testnet DUST fee tokens from the official faucet:
   `https://faucet.preprod.midnight.network/api/drips`

---

## 13. Contract Compilation

Compile the Compact smart contract to generate TypeScript bindings, ZKIR circuits, and proving keys:

```bash
# Compile contract
yarn compile

# Copy auto-generated bindings and ZK keys to frontend
yarn copy:managed
```

---

## 14. Preprod Deployment

### Option A: Via Browser Admin Portal (Recommended)
1. Start the frontend: `cd frontend && yarn dev`
2. Open `http://localhost:5173/admin`
3. Connect your 1AM wallet on Preprod.
4. Click **Deploy Contract to Midnight Preprod**.
5. The deployed address will automatically be stored and used for verification.

### Option B: Via Command Line
```bash
yarn test:preprod
```

---

## 15. Running the Frontend

```bash
cd frontend
yarn dev
```
Open `http://localhost:5173/` in your browser.

---

## 16. Testing

ProofRent includes comprehensive unit, cryptographic, and circuit assertion tests covering:
- Pure circuit deterministic hashing (admin keys, commitments, nullifiers)
- Contract state initialization and criteria configuration
- Credential issuance into public registry
- Zero-Knowledge verification for qualifying tenants
- Exact boundary condition testing (12 months, 90% score, 0 infractions)
- Anti-replay nullifier prevention
- Rejection of failed leases, short tenancies, poor payments, and excessive violations
- Credential revocation and unauthorized access rejection

```bash
# Run all 23 tests
yarn test

# Typecheck both root and frontend
yarn typecheck
cd frontend && npx tsc --noEmit
```

---

## 17. CI/CD Pipeline

The automated CI/CD pipeline (`.github/workflows/ci.yaml`) executes on every push and pull request:
1. Sets up the official Compact compiler (`midnightntwrk/setup-compact-action@836895c8fffbbea6bd986af2b17e8941ff29d1f8`).
2. Installs Node.js 22.
3. Compiles `contracts/proofrent.compact`.
4. Runs the comprehensive Vitest test suite.
5. Builds the production frontend bundle and copies managed ZK artifacts.

---

## 18. Security Considerations

- **Entropy:** Blinding salts contain 256 bits of cryptographically secure random entropy, preventing rainbow table attacks.
- **Anti-Replay:** Deterministic nullifiers derived from private tenant ID and commitment prevent credential re-use.
- **Revocation Safety:** Non-membership in `revoked_credentials` is evaluated inside the zero-knowledge circuit.
- **Client-Side Execution:** Unencrypted addresses, rent amounts, and contracts are never transmitted over the network.

---

## 19. Project Structure

```
ProofRent/
├── contracts/
│   ├── proofrent.compact          <- Source Compact contract
│   ├── index.ts                   <- Typed contract bindings
│   └── managed/                   <- Auto-generated compiler artifacts
│       └── proofrent/
│           ├── contract/          <- TypeScript runtime classes & definitions
│           ├── keys/              <- Proving (.pk) & Verifying (.vk) keys
│           └── zkir/              <- Zero-knowledge intermediate representations
├── frontend/
│   ├── public/
│   │   ├── managed/               <- ZK keys served at runtime
│   │   └── shield-key.svg         <- Brand icon
│   ├── src/
│   │   ├── components/            <- UI & Navigation components
│   │   │   ├── Navbar.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── SelectiveDisclosureDiagram.tsx
│   │   │   └── ProofModal.tsx
│   │   ├── contexts/              <- State providers
│   │   │   ├── WalletContext.tsx  <- Midnight wallet connector
│   │   │   └── RentalDataContext.tsx
│   │   ├── lib/
│   │   │   ├── midnight.ts        <- Core Midnight SDK provider factory
│   │   │   └── proofHistory.ts    <- Client-side verification receipts
│   │   ├── managed/contract/      <- Imported TypeScript contract types
│   │   ├── pages/                 <- User interface screens
│   │   │   ├── LandingPage.tsx
│   │   │   ├── TenantDashboardPage.tsx
│   │   │   ├── VerifyProofPage.tsx
│   │   │   ├── RequestsPage.tsx
│   │   │   ├── IssueCredentialPage.tsx
│   │   │   └── AdminDeployPage.tsx
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   ├── config.ts
│   │   └── index.css
│   ├── package.json
│   └── vite.config.ts
├── src/
│   ├── config.ts                  <- Backend network configurations
│   ├── providers.ts               <- Midnight provider builders
│   ├── wallet.ts                  <- Wallet secret resolution
│   └── test/
│       └── proofrent.test.ts      <- 23 passing circuit & contract tests
├── docs/                          <- Architectural documentation
│   ├── architecture.md
│   ├── privacy-model.md
│   ├── contract-design.md
│   ├── threat-model.md
│   └── user-flows.md
├── scripts/
│   ├── compile.js                 <- Cross-platform compiler wrapper
│   ├── copy-managed.js            <- Build asset synchronizer
│   └── wait-for-dust.ts           <- Local devnet DUST polling
├── .github/workflows/ci.yaml      <- CI pipeline
├── compose.yml                    <- Docker Midnight node + proof-server
├── .env.preprod.example           <- Environment template
├── package.json                   <- Root configuration
├── tsconfig.json                  <- TypeScript configuration
├── vitest.config.ts               <- Vitest configuration
├── proposals.md                   <- 8 strategic expansion proposals
└── README.md                      <- Project documentation
```

---

## 20. Level 4 Readiness Checklist

- [x] **Working Preprod MVP:** Compatible with Midnight Preprod testnet.
- [x] **Actual Midnight Integration:** Uses `@midnight-ntwrk/midnight-js-contracts`, `compact-runtime`, and `ledger-v8`.
- [x] **Compact Smart Contract:** `contracts/proofrent.compact` compiled with Compact 0.31.0 / 0.5.2.
- [x] **Meaningful Tests:** 23 passing tests covering circuits, assertions, nullifiers, and revocation.
- [x] **Human-Designed UI:** Restrained, high-contrast dark theme; zero generic AI gradients or fake social proof.
- [x] **Wallet Integration:** 1AM, Lace, and Nightly support via `WalletContext.tsx`.
- [x] **CI/CD Pipeline:** Fully configured GitHub Actions workflow (`ci.yaml`).
- [x] **Architectural Documentation:** 5 detailed technical documents in `docs/`.
- [x] **Strategic Proposals:** `proposals.md` detailing 8 comprehensive expansion proposals.
- [x] **No Fake Blockchain Data:** Zero mocked hashes; real cryptographic commitments and nullifiers.

---

## 21. License

MIT License. Built for the Midnight Network ecosystem.
