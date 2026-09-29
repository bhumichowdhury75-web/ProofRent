# ProofRent

**Privacy-Preserving Rental History Verification on the Midnight Network**

[![Midnight Network](https://img.shields.io/badge/Network-Midnight-blueviolet?style=for-the-badge)](https://midnight.network)
[![Language](https://img.shields.io/badge/Language-Compact-orange?style=for-the-badge)](https://midnight.network)
[![Tested With](https://img.shields.io/badge/Tested%20With-Vitest-yellow?style=for-the-badge)](https://vitest.dev)
[![State](https://img.shields.io/badge/Level-4%20Complete-success?style=for-the-badge)](#)
[![CI](https://github.com/bhumichowdhury75-web/ProofRent/actions/workflows/ci.yaml/badge.svg)](https://github.com/bhumichowdhury75-web/ProofRent/actions/workflows/ci.yaml)
[![Live App](https://img.shields.io/badge/Live%20App-Vercel-success?style=for-the-badge&logo=vercel)](https://proof-rent-zeta.vercel.app/)
[![Demo Video](https://img.shields.io/badge/Demo%20Video-Google%20Drive-red?style=for-the-badge&logo=google-drive)](https://drive.google.com/file/d/1bwW57Fg6nXwPgy4gvnMphos0hCo99d8i/view?usp=sharing)
[![Deploy on Vercel](https://img.shields.io/badge/Deploy-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/new/clone?repository-url=https://github.com/bhumichowdhury75-web/ProofRent&root=frontend)
[![X (Twitter) Follow](https://img.shields.io/badge/X-Follow-blue?style=for-the-badge&logo=x)](#)

---

## Abstract

ProofRent is a decentralized application (dApp) engineered on the **Midnight Network** utilizing the **Compact** smart contract language. The platform serves as a Zero-Knowledge (ZK) eligibility gate and selective disclosure protocol for residential rental history. It allows tenants to cryptographically prove that they meet stringent leasing requirements (such as minimum tenancy duration, on-time payment reliability score, and zero unresolved lease violations) without ever exposing their raw, sensitive personal data (previous residential addresses, exact rent payments, full lease PDFs, or previous landlord contact details) to centralized portals, screening agencies, prospective landlords, or the public blockchain ledger.

---

## Table of Contents

1. [Official Submission Links](#official-submission-links)
2. [Architectural Overview](#architectural-overview)
3. [Zero-Knowledge Privacy Model](#zero-knowledge-privacy-model)
4. [August Submission Updates](#august-submission-updates)
5. [Smart Contract Implementation](#smart-contract-implementation)
6. [Hackathon Progression (Levels 1-4)](#hackathon-progression-levels-1-4)
7. [Project Showcase & Verification Proofs](#project-showcase--verification-proofs)
8. [Local Development & Setup Guide](#local-development--setup-guide)
9. [Author & Acknowledgements](#author--acknowledgements)

---

## Official Submission Links

- **Live Application (Vercel):** [https://proof-rent-zeta.vercel.app/](https://proof-rent-zeta.vercel.app/)
- **Deployed Contract (Midnight Preprod):** [mn_addr_preprod1fjw64hh5veuayhl782sxggpq8jfp0vq0zvv3cvz94nv7cnzu9clqp3zk9e](https://preprod.midnightexplorer.com/contracts/mn_addr_preprod1fjw64hh5veuayhl782sxggpq8jfp0vq0zvv3cvz94nv7cnzu9clqp3zk9e)
- **Demo Video Presentation:** [Watch on Google Drive](https://drive.google.com/file/d/1bwW57Fg6nXwPgy4gvnMphos0hCo99d8i/view?usp=sharing)
- **Public Brand Presence (X Profile):** *(Post link to be provided)*

---

## Architectural Overview

ProofRent bridges modern web infrastructure with cutting-edge cryptographic privacy networks.

- **Smart Contract Layer:** Written in Compact (`contracts/proofrent.compact`), compiled to WebAssembly (WASM) and Zero-Knowledge Intermediate Representation (ZKIR). Deployed on the Midnight Preprod network.
- **Frontend Application Layer:** Built with React 19, TypeScript, and Vite. Styled using a bespoke, human-crafted dark obsidian and neon prism design system via modern CSS.
- **Wallet Infrastructure:** Integrated with the `@midnight-ntwrk/dapp-connector-api` to interface directly with the 1AM and Lace browser extension wallets for local proof generation and transaction signing.
- **Testing & CI/CD:** End-to-end testing utilizing Vitest and local Docker-based Midnight environments. Automated CI/CD pipelines via GitHub Actions.

---

## Zero-Knowledge Privacy Model

The core value proposition of ProofRent is absolute data privacy for rental applicants.

### The Traditional Vulnerability
In legacy screening systems, tenants must upload unencrypted, highly sensitive documents (full lease contracts, past rent stubs, bank statements, personal references, and complete physical addresses) to centralized property management databases. These databases are notorious targets for data breaches, exposing private living history, financial leverage, and personal identification to unauthorized third parties.

### The ProofRent ZK Solution
ProofRent eliminates the need for data transmission. Verification is entirely mathematical.

1. **Public State (Ledger Data):** The landlord or housing authority publishes the verification criteria thresholds (`min_tenancy_months`, `min_payment_score`, `max_violations`, and `min_completed_leases`) and issued credential commitments (`credential_registry`) to the public Midnight ledger. These values and commitments are fully transparent and verifiable by any observer.
2. **Private Witness (User Data):** The tenant holds their rental credentials (`tenancy_months`, `payment_score`, `violations`, `completed_leases`, `lease_completed`, and `credential_salt`) locally in their browser vault. These values are designated as "private witnesses" in the Compact circuit.
3. **Local Proof Generation:** The tenant's browser wallet runs a localized Zero-Knowledge circuit. It validates that the private credential commitment exists in the public registry, is unrevoked, satisfies the landlord's screening criteria, and generates an unforgeable nullifier to prevent replay attacks.
4. **On-Chain Verification:** The wallet submits a cryptographic proof to the Midnight blockchain. The network validators verify the math without ever seeing the underlying private inputs.

**Observer Matrix:**
- **Visible on-chain:** The verification criteria thresholds, the opaque credential commitment hash (32 bytes), the anti-replay nullifier hash, the user's public address, and the boolean verification signal.
- **Hidden permanently:** The tenant's physical previous addresses, exact monthly rent paid, landlord contact information, full lease agreement, exact payment scores, and individual violation specifics.

---

## August Submission Updates

### Bug Fixes & Refactors

- **Wallet Connection Leaks**: Cleans up polling intervals on disconnect and network shifts.
- **Footer Address Truncation**: Ensures contract addresses don't overflow on mobile screens.
- **Mobile Navbar**: Clean responsive navigation with mobile drawer and quick status indicators.
- **Double-submit bugs**: Disabled verify and issuance buttons when generating ZK proofs.
- **Private State Password**: Securely loaded from environment variables and local session storage.
- **Input Edge Cases**: Boundary tenancy months, payment scores (0-100), and invalid salts guarded.
- **Custom Contexts**: Modular state hooks via `WalletContext` and `RentalDataContext`.
- **Accessibility**: Added ARIA live regions and keyboard handlers to `ModalFrame` and `ProofModal`.

### Test Additions

| Test | What it covers |
|------|----------------|
| `Generates deterministic nullifiers for replay protection` | Cryptographic assertion: verifies identical inputs produce matching nullifiers |
| `Ensures distinct nullifiers across different tenants or credentials` | Sybil resistance: validates uniqueness across varying tenant IDs and salts |
| `Verifies applicant at exact boundary values (12 months, 90% score, 0 violations)` | Boundary condition: duration == min and score == min passes cleanly (>= and <= checks) |
| `Rejects verification when tenancy duration is below threshold (e.g. 8 months < 12 months)` | Circuit constraint: fails when tenancy length does not satisfy minimum policy |
| `Rejects verification when rent payment reliability score is below threshold (85% < 90%)` | Circuit constraint: rejects applicants with sub-threshold payment track record |
| `Rejects verification when lease infractions exceed allowable limit (1 > 0)` | Clean record check: fails when unresolved infractions exceed policy maximum |
| `Prevents double-verification / replay using nullifier set` | State transition: duplicate verification within active window is strictly rejected |
| `Allows authority to revoke an issued credential` | Governance & safety: revoked commitments fail on-chain verification |

### New Features (Mid-August Sprint)

- **Interactive Requests & Scope Manager** (`frontend/src/pages/RequestsPage.tsx`)
  - Real-time statistics summary cards for total scopes, awaiting proof, and satisfied requests
  - Interactive verification scope cards with policy requirements (tenancy, payment score, infractions)
  - Modal-based verification request creator with instant tenant fulfillment trigger
  - Local browser-backed storage with cryptographic receipt export

- **Client-Side Selective Disclosure Simulator** (`frontend/src/components/SelectiveDisclosureDiagram.tsx`)
  - Simulates the Zero-Knowledge circuit locally before triggering the wallet extension
  - Interactive duration and payment reliability sliders with instant visual feedback
  - Clearly demonstrates the boundary between private witnesses (sealed) and public cryptographic signals (revealed)

- **Live On-chain Criteria & Contract Deployer** (`frontend/src/pages/AdminDeployPage.tsx`)
  - One-click contract deployment to Midnight Preprod directly from browser wallet
  - Real-time deployment status feedback with transaction hashes and contract initialization
  - Network guard warning users if their wallet is connected to an incompatible network

- **UI & UX Improvements**
  - High-fidelity SVG icon system (`frontend/src/components/PrismIcons.tsx`) with zero heavy dependencies
  - Accessible modal dialog component (`frontend/src/components/ModalFrame.tsx`) with escape key and backdrop dismissal
  - Proof inspection and export modal (`frontend/src/components/ProofModal.tsx`) for JSON receipts
  - Double-submit guards to prevent concurrent ZK proof syntheses in wallet

---

## Smart Contract Implementation

The Compact contract (`contracts/proofrent.compact`) is designed for maximum security and data minimization.

```compact
pragma language_version >= 0.22;

import CompactStandardLibrary;

// Public Ledger State (On-chain, verifiable by anyone)
export ledger min_tenancy_months: Uint<32>;
export ledger min_payment_score: Uint<32>;       // Minimum on-time percentage (e.g. 90 = 90%)
export ledger max_violations: Uint<32>;          // Maximum allowable lease violations (e.g. 0)
export ledger min_completed_leases: Uint<32>;    // Minimum completed leases required (e.g. 1)
export ledger admin: Bytes<32>;                  // Hash of platform authority / governance key
export ledger is_active: Boolean;                // Protocol operational status flag
export ledger total_verifications: Uint<32>;     // Total ZK verifications processed
export ledger total_credentials: Uint<32>;       // Total credentials registered
export ledger deadline: Uint<64>;                // Active verification cycle deadline
export ledger credential_registry: Set<Bytes<32>>; // Issued credential commitments
export ledger revoked_credentials: Set<Bytes<32>>; // Revoked credential commitments
export ledger nullifiers: Set<Bytes<32>>;        // Replay prevention nullifiers

// Private Witnesses (Never revealed on-chain, evaluated locally in ZK proof)
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

// Constructor - Initialized upon deployment to Midnight Preprod / Local
constructor(
    initial_min_months: Uint<32>,
    initial_min_score: Uint<32>,
    initial_max_violations: Uint<32>,
    initial_min_completed_leases: Uint<32>,
    initial_admin: Bytes<32>,
    initial_deadline: Uint<64>
) {
    min_tenancy_months = disclose(initial_min_months);
    min_payment_score = disclose(initial_min_score);
    max_violations = disclose(initial_max_violations);
    min_completed_leases = disclose(initial_min_completed_leases);
    admin = disclose(initial_admin);
    deadline = disclose(initial_deadline);
    is_active = disclose(true);
    total_verifications = disclose(0);
    total_credentials = disclose(0);
}

// Core Verification Circuit (Tenant proves rental claims with zero disclosure)
export circuit verify_rental_history(): [] {
    assert(disclose(is_active), "ProofRent verification is currently paused");
    assert(blockTimeLt(disclose(deadline)), "Verification deadline has passed");

    const creds = rental_credential();
    const commitment = credentialCommitment(creds.tenant_id, creds.credential_salt);
    assert(credential_registry.member(disclose(commitment)), "Credential commitment not found in registry");
    assert(!revoked_credentials.member(disclose(commitment)), "Credential has been revoked by landlord");

    assert(creds.lease_completed, "Tenant lease was not marked completed in good standing");
    assert(creds.tenancy_months >= min_tenancy_months, "Tenancy duration fails minimum threshold");
    assert(creds.payment_score >= min_payment_score, "Payment reliability score fails minimum threshold");
    assert(creds.violations <= max_violations, "Lease infractions exceed maximum allowed");
    assert(creds.completed_leases >= min_completed_leases, "Completed leases count fails minimum threshold");

    const nul = makeNullifier(creds.tenant_id, commitment);
    assert(!nullifiers.member(disclose(nul)), "Credential has already been verified in this window");

    nullifiers.insert(disclose(nul));
    total_verifications = disclose((total_verifications + 1) as Uint<32>);
}

export circuit issue_credential(commitment: Bytes<32>): [] {
    assert(disclose(is_active), "Credential issuance is currently paused");
    assert(!credential_registry.member(disclose(commitment)), "Credential commitment already registered");

    credential_registry.insert(disclose(commitment));
    total_credentials = disclose((total_credentials + 1) as Uint<32>);
}

export circuit revoke_credential(commitment: Bytes<32>): [] {
    const admin_sk = admin_secret_key();
    assert(adminPublicKey(admin_sk) == admin, "Unauthorized revocation attempt");
    assert(credential_registry.member(disclose(commitment)), "Credential commitment not registered");
    assert(!revoked_credentials.member(disclose(commitment)), "Credential already revoked");

    revoked_credentials.insert(disclose(commitment));
}

export circuit update_policy(
    new_min_months: Uint<32>,
    new_min_score: Uint<32>,
    new_max_violations: Uint<32>,
    new_min_completed_leases: Uint<32>,
    new_deadline: Uint<64>
): [] {
    const admin_sk = admin_secret_key();
    assert(adminPublicKey(admin_sk) == admin, "Unauthorized policy update attempt");

    min_tenancy_months = disclose(new_min_months);
    min_payment_score = disclose(new_min_score);
    max_violations = disclose(new_max_violations);
    min_completed_leases = disclose(new_min_completed_leases);
    deadline = disclose(new_deadline);
}
```

---

## Hackathon Progression (Levels 1-4)

This repository fulfills the strict progression requirements of the "New Moon to Full" Midnight Builder Journey.

### Level 1: Setup & First Contract
- **Objective:** Establish the WSL2/Docker toolchain, write the foundational Compact contract, and document the product proposal (Private Rental History Gate).
- **Status:** Complete. The contract successfully compiles, generating the required `zkir` and `bzkir` proving artifacts and TypeScript runtime bindings.

### Level 2: Frontend Integration
- **Objective:** Develop a robust frontend interface and establish wallet connectivity.
- **Status:** Complete. The application successfully interfaces with the 1AM and Lace wallets via the Midnight DApp Connector API.
- **Deployed Contract Address (Preprod):** 
  [mn_addr_preprod1fjw64hh5veuayhl782sxggpq8jfp0vq0zvv3cvz94nv7cnzu9clqp3zk9e](https://preprod.midnightexplorer.com/contracts/mn_addr_preprod1fjw64hh5veuayhl782sxggpq8jfp0vq0zvv3cvz94nv7cnzu9clqp3zk9e)

### Level 3: Production-Grade dApp
- **Objective:** Implement automated testing, Continuous Integration (CI/CD), and a polished user interface.
- **Status:** Complete. Vitest suites assert both successful verification and expected failure modes across 23 circuit assertions. GitHub Actions workflows automatically test and build the contract and frontend on every push.

### Level 4: MVP Goes Live
- **Objective:** Deploy the frontend to a production CDN, finalize documentation, and establish a public brand presence.
- **Status:** Complete.
  - **Live Application:** [https://proof-rent-zeta.vercel.app/](https://proof-rent-zeta.vercel.app/)
  - **Deployed Contract (Preprod):** [mn_addr_preprod1fjw64hh5veuayhl782sxggpq8jfp0vq0zvv3cvz94nv7cnzu9clqp3zk9e](https://preprod.midnightexplorer.com/contracts/mn_addr_preprod1fjw64hh5veuayhl782sxggpq8jfp0vq0zvv3cvz94nv7cnzu9clqp3zk9e)
  - **Demo Video Presentation:** [Watch on Google Drive](https://drive.google.com/file/d/1bwW57Fg6nXwPgy4gvnMphos0hCo99d8i/view?usp=sharing)
  - **Public Brand Presence (X Profile):** *(Post link to be provided)*

---

## Project Showcase & Verification Proofs

### User Interface 
![UI Screenshot 1](./sub%20assets/ui1.png)
![UI Screenshot 2](./sub%20assets/ui2.png)
![UI Screenshot 3](./sub%20assets/ui3.png)

### Contract Compilation Artifacts
![Successful Compilation](./sub%20assets/yarn%20compile%20ss.png)

### Automated Test Suite Execution
![Passing Tests](./sub%20assets/test%20output.png)

### Production Build Verification
![Production Build](./sub%20assets/build%20output.png)

---

## Local Development & Setup Guide

For developers and auditors wishing to verify the Zero-Knowledge circuits and run the application locally, please follow these instructions carefully.

### 1. System Requirements
- **OS:** Windows Subsystem for Linux 2 (WSL2 - Ubuntu 24.04/26.04), Windows 11, or native Linux/macOS.
- **Containerization:** Docker Desktop with WSL2 integration enabled.
- **Runtime:** Node.js (v22.0.0 or higher) and Yarn package manager.

### 2. Dependency Initialization
Clone the repository and install the workspace dependencies from the root directory:
```bash
git clone https://github.com/bhumichowdhury75-web/ProofRent.git
cd ProofRent
yarn install
```

### 3. Smart Contract Compilation
Compile the Compact zero-knowledge circuits into intermediate representation and generate the strictly-typed TypeScript interfaces:
```bash
yarn compile
yarn copy:managed
```
*Note: This command populates the `contracts/managed/proofrent/` directory with the necessary prover keys, ZKIR circuits, and API definitions, and synchronizes them to the frontend.*

### 4. Running the Local Midnight Network and Test Suite
To run the automated tests, you must initialize the local Midnight Docker network (which spins up a local indexer, proof-server, and blockchain node):
```bash
yarn env:up
yarn test
```
Once testing is complete, gracefully terminate the Docker instances to free up system resources:
```bash
yarn env:down
```

### 5. Running the Frontend Application
To run the React frontend locally and interact with the smart contract:
```bash
cd frontend
yarn install
yarn dev
```
Navigate to `http://localhost:5173`. You must have the **1AM wallet** or **Midnight Lace** browser extension installed and configured to the appropriate network (Local or Preprod) to interact with the application.

---

## Author & Acknowledgements

**ProofRent** is developed as part of the Midnight Network hackathon.

- **GitHub:** [@bhumichowdhury75-web](https://github.com/bhumichowdhury75-web)
- **X (Twitter):** *(Links to be provided)*

*Built with privacy and security in mind on the Midnight Network.*
