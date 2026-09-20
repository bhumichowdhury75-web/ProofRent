import { describe, it, expect, beforeAll } from 'vitest';
import crypto from 'crypto';
import { createCircuitContext, sampleContractAddress } from '@midnight-ntwrk/compact-runtime';
import { pureCircuits, Contract, ledger } from '../../contracts/index.js';

describe('ProofRent Smart Contract & Privacy Circuits', () => {
  let adminSk: Uint8Array;
  let adminPk: Uint8Array;
  let tenantId1: Uint8Array;
  let tenantId2: Uint8Array;
  let credSalt1: Uint8Array;
  let credSalt2: Uint8Array;
  let credCommitment1: Uint8Array;
  let credCommitment2: Uint8Array;

  const MIN_MONTHS = 12n;
  const MIN_PAYMENT_SCORE = 90n;
  const MAX_VIOLATIONS = 0n;
  const MIN_COMPLETED_LEASES = 1n;
  const FUTURE_DEADLINE = BigInt(Math.floor(Date.now() / 1000) + 365 * 24 * 60 * 60);

  function makeWitnesses(creds: any, sk: Uint8Array) {
    return {
      rental_credential: () => [{}, creds] as [any, any],
      admin_secret_key: () => [{}, sk] as [any, Uint8Array],
    };
  }

  function makeCircuitContext(state: any) {
    return (createCircuitContext as any)(
      sampleContractAddress(),
      new Uint8Array(32),
      state,
      {},
    );
  }

  const constructorContext: any = {
    initialPrivateState: {},
    initialZswapLocalState: {
      coinPublicKey: new Uint8Array(32),
      currentIndex: 0n,
      inputs: [],
      outputs: [],
    },
  };

  beforeAll(() => {
    adminSk = new Uint8Array(crypto.randomBytes(32));
    adminPk = pureCircuits.adminPublicKey(adminSk);

    tenantId1 = new Uint8Array(crypto.randomBytes(32));
    tenantId2 = new Uint8Array(crypto.randomBytes(32));

    credSalt1 = new Uint8Array(crypto.randomBytes(32));
    credSalt2 = new Uint8Array(crypto.randomBytes(32));

    credCommitment1 = pureCircuits.credentialCommitment(tenantId1, credSalt1);
    credCommitment2 = pureCircuits.credentialCommitment(tenantId2, credSalt2);
  });

  describe('1. Pure Cryptographic Circuits', () => {
    it('Derives deterministic 32-byte admin public keys from secret keys', () => {
      expect(adminPk).toBeInstanceOf(Uint8Array);
      expect(adminPk.length).toBe(32);
      const recomputed = pureCircuits.adminPublicKey(adminSk);
      expect(recomputed).toEqual(adminPk);
    });

    it('Derives distinct public keys for different secret keys', () => {
      const otherSk = new Uint8Array(crypto.randomBytes(32));
      const otherPk = pureCircuits.adminPublicKey(otherSk);
      expect(otherPk).not.toEqual(adminPk);
    });

    it('Generates deterministic credential commitments', () => {
      expect(credCommitment1).toBeInstanceOf(Uint8Array);
      expect(credCommitment1.length).toBe(32);
      const recomputed = pureCircuits.credentialCommitment(tenantId1, credSalt1);
      expect(recomputed).toEqual(credCommitment1);
    });

    it('Generates distinct credential commitments when blinding salt varies', () => {
      const altSalt = new Uint8Array(crypto.randomBytes(32));
      const altCommitment = pureCircuits.credentialCommitment(tenantId1, altSalt);
      expect(altCommitment).not.toEqual(credCommitment1);
    });

    it('Generates deterministic nullifiers for replay protection', () => {
      const nul1 = pureCircuits.makeNullifier(tenantId1, credCommitment1);
      const nul2 = pureCircuits.makeNullifier(tenantId1, credCommitment1);
      expect(nul1).toEqual(nul2);
      expect(nul1.length).toBe(32);
    });

    it('Ensures distinct nullifiers across different tenants or credentials', () => {
      const nul1 = pureCircuits.makeNullifier(tenantId1, credCommitment1);
      const nul2 = pureCircuits.makeNullifier(tenantId2, credCommitment2);
      expect(nul1).not.toEqual(nul2);
    });
  });

  describe('2. Contract Initialization & State Setup', () => {
    it('Instantiates the compiled ProofRent contract with required witness signatures', () => {
      const witnesses = makeWitnesses({
        tenant_id: tenantId1,
        tenancy_months: 14n,
        payment_score: 98n,
        violations: 0n,
        completed_leases: 1n,
        lease_completed: true,
        credential_salt: credSalt1,
      }, adminSk);

      const contract = new Contract(witnesses);
      expect(contract).toBeDefined();
      expect(contract.circuits.verify_rental_history).toBeTypeOf('function');
      expect(contract.circuits.issue_credential).toBeTypeOf('function');
      expect(contract.circuits.revoke_credential).toBeTypeOf('function');
      expect(contract.circuits.update_policy).toBeTypeOf('function');
    });

    it('Initializes contract state with verification policy criteria', () => {
      const contract = new Contract(makeWitnesses({
        tenant_id: tenantId1,
        tenancy_months: 14n,
        payment_score: 98n,
        violations: 0n,
        completed_leases: 1n,
        lease_completed: true,
        credential_salt: credSalt1,
      }, adminSk));

      const initResult = contract.initialState(
        constructorContext,
        MIN_MONTHS,
        MIN_PAYMENT_SCORE,
        MAX_VIOLATIONS,
        MIN_COMPLETED_LEASES,
        adminPk,
        FUTURE_DEADLINE,
      );

      const context = makeCircuitContext(initResult.currentContractState);
      const state = ledger(context.currentQueryContext.state);
      expect(state.min_tenancy_months).toBe(MIN_MONTHS);
      expect(state.min_payment_score).toBe(MIN_PAYMENT_SCORE);
      expect(state.max_violations).toBe(MAX_VIOLATIONS);
      expect(state.min_completed_leases).toBe(MIN_COMPLETED_LEASES);
      expect(state.admin).toEqual(adminPk);
      expect(state.is_active).toBe(true);
      expect(state.total_verifications).toBe(0n);
      expect(state.total_credentials).toBe(0n);
      expect(state.credential_registry.size()).toBe(0n);
      expect(state.revoked_credentials.size()).toBe(0n);
      expect(state.nullifiers.size()).toBe(0n);
    });
  });

  describe('3. Credential Issuance Lifecycle', () => {
    it('Issues a credential commitment into the public registry', () => {
      const contract = new Contract(makeWitnesses({
        tenant_id: tenantId1,
        tenancy_months: 14n,
        payment_score: 98n,
        violations: 0n,
        completed_leases: 1n,
        lease_completed: true,
        credential_salt: credSalt1,
      }, adminSk));

      const initResult = contract.initialState(
        constructorContext,
        MIN_MONTHS,
        MIN_PAYMENT_SCORE,
        MAX_VIOLATIONS,
        MIN_COMPLETED_LEASES,
        adminPk,
        FUTURE_DEADLINE,
      );

      const circuitContext = makeCircuitContext(initResult.currentContractState);
      const issueResult = contract.circuits.issue_credential(circuitContext, credCommitment1);
      expect(issueResult).toBeDefined();

      const updatedState = ledger(issueResult.context.currentQueryContext.state);
      expect(updatedState.total_credentials).toBe(1n);
      expect(updatedState.credential_registry.member(credCommitment1)).toBe(true);
    });

    it('Rejects duplicate registration of the same credential commitment', () => {
      const contract = new Contract(makeWitnesses({
        tenant_id: tenantId1,
        tenancy_months: 14n,
        payment_score: 98n,
        violations: 0n,
        completed_leases: 1n,
        lease_completed: true,
        credential_salt: credSalt1,
      }, adminSk));

      const initResult = contract.initialState(
        constructorContext,
        MIN_MONTHS,
        MIN_PAYMENT_SCORE,
        MAX_VIOLATIONS,
        MIN_COMPLETED_LEASES,
        adminPk,
        FUTURE_DEADLINE,
      );

      const circuitContext = makeCircuitContext(initResult.currentContractState);
      const step1 = contract.circuits.issue_credential(circuitContext, credCommitment1);

      // Attempt duplicate issue
      expect(() => {
        contract.circuits.issue_credential(step1.context, credCommitment1);
      }).toThrow(/already registered/);
    });
  });

  describe('4. Privacy-Preserving Rental Verification Flow', () => {
    function setupDeployedContractWithCredential(credsWitness: any) {
      const contract = new Contract(makeWitnesses(credsWitness, adminSk));

      const initResult = contract.initialState(
        constructorContext,
        MIN_MONTHS,
        MIN_PAYMENT_SCORE,
        MAX_VIOLATIONS,
        MIN_COMPLETED_LEASES,
        adminPk,
        FUTURE_DEADLINE,
      );

      const circuitContext = makeCircuitContext(initResult.currentContractState);
      const commitment = pureCircuits.credentialCommitment(credsWitness.tenant_id, credsWitness.credential_salt);
      const step1 = contract.circuits.issue_credential(circuitContext, commitment);

      return { contract, context: step1.context, commitment };
    }

    it('Verifies a qualified tenant meeting all criteria in zero knowledge', () => {
      const validCreds = {
        tenant_id: tenantId1,
        tenancy_months: 18n,
        payment_score: 95n,
        violations: 0n,
        completed_leases: 1n,
        lease_completed: true,
        credential_salt: credSalt1,
      };

      const { contract, context } = setupDeployedContractWithCredential(validCreds);

      const verifyResult = contract.circuits.verify_rental_history(context);
      expect(verifyResult).toBeDefined();

      const finalState = ledger(verifyResult.context.currentQueryContext.state);
      expect(finalState.total_verifications).toBe(1n);

      const expectedNul = pureCircuits.makeNullifier(tenantId1, credCommitment1);
      expect(finalState.nullifiers.member(expectedNul)).toBe(true);
    });

    it('Verifies applicant at exact boundary values (12 months, 90% score, 0 violations)', () => {
      const boundaryCreds = {
        tenant_id: tenantId1,
        tenancy_months: 12n,
        payment_score: 90n,
        violations: 0n,
        completed_leases: 1n,
        lease_completed: true,
        credential_salt: credSalt1,
      };

      const { contract, context } = setupDeployedContractWithCredential(boundaryCreds);
      const verifyResult = contract.circuits.verify_rental_history(context);
      const finalState = ledger(verifyResult.context.currentQueryContext.state);
      expect(finalState.total_verifications).toBe(1n);
    });

    it('Prevents double-verification / replay using nullifier set', () => {
      const validCreds = {
        tenant_id: tenantId1,
        tenancy_months: 15n,
        payment_score: 92n,
        violations: 0n,
        completed_leases: 1n,
        lease_completed: true,
        credential_salt: credSalt1,
      };

      const { contract, context } = setupDeployedContractWithCredential(validCreds);
      const verifyResult = contract.circuits.verify_rental_history(context);

      // Second attempt using the same credential
      expect(() => {
        contract.circuits.verify_rental_history(verifyResult.context);
      }).toThrow(/already been verified/);
    });

    it('Rejects verification when lease was not completed in good standing', () => {
      const failedLeaseCreds = {
        tenant_id: tenantId1,
        tenancy_months: 24n,
        payment_score: 99n,
        violations: 0n,
        completed_leases: 1n,
        lease_completed: false, // Incomplete lease
        credential_salt: credSalt1,
      };

      const { contract, context } = setupDeployedContractWithCredential(failedLeaseCreds);

      expect(() => {
        contract.circuits.verify_rental_history(context);
      }).toThrow(/lease was not marked completed/);
    });

    it('Rejects verification when tenancy duration is below threshold (e.g. 8 months < 12 months)', () => {
      const shortTenancyCreds = {
        tenant_id: tenantId1,
        tenancy_months: 8n, // Below MIN_MONTHS (12n)
        payment_score: 99n,
        violations: 0n,
        completed_leases: 1n,
        lease_completed: true,
        credential_salt: credSalt1,
      };

      const { contract, context } = setupDeployedContractWithCredential(shortTenancyCreds);

      expect(() => {
        contract.circuits.verify_rental_history(context);
      }).toThrow(/duration fails minimum threshold/);
    });

    it('Rejects verification when rent payment reliability score is below threshold (e.g. 85% < 90%)', () => {
      const poorPaymentCreds = {
        tenant_id: tenantId1,
        tenancy_months: 14n,
        payment_score: 85n, // Below MIN_PAYMENT_SCORE (90n)
        violations: 0n,
        completed_leases: 1n,
        lease_completed: true,
        credential_salt: credSalt1,
      };

      const { contract, context } = setupDeployedContractWithCredential(poorPaymentCreds);

      expect(() => {
        contract.circuits.verify_rental_history(context);
      }).toThrow(/reliability score fails minimum threshold/);
    });

    it('Rejects verification when lease infractions exceed allowable limit (e.g. 1 violation > 0)', () => {
      const violationCreds = {
        tenant_id: tenantId1,
        tenancy_months: 24n,
        payment_score: 98n,
        violations: 1n, // Exceeds MAX_VIOLATIONS (0n)
        completed_leases: 1n,
        lease_completed: true,
        credential_salt: credSalt1,
      };

      const { contract, context } = setupDeployedContractWithCredential(violationCreds);

      expect(() => {
        contract.circuits.verify_rental_history(context);
      }).toThrow(/infractions exceed maximum allowed/);
    });

    it('Rejects verification when completed leases count is below threshold (0 < 1)', () => {
      const noCompletedCreds = {
        tenant_id: tenantId1,
        tenancy_months: 14n,
        payment_score: 95n,
        violations: 0n,
        completed_leases: 0n, // Below MIN_COMPLETED_LEASES (1n)
        lease_completed: true,
        credential_salt: credSalt1,
      };

      const { contract, context } = setupDeployedContractWithCredential(noCompletedCreds);

      expect(() => {
        contract.circuits.verify_rental_history(context);
      }).toThrow(/Completed leases count fails/);
    });

    it('Rejects verification when credential commitment was never registered', () => {
      const unregisteredCreds = {
        tenant_id: tenantId1,
        tenancy_months: 24n,
        payment_score: 100n,
        violations: 0n,
        completed_leases: 2n,
        lease_completed: true,
        credential_salt: credSalt1,
      };

      // Contract deployed without issuing the commitment
      const contract = new Contract(makeWitnesses(unregisteredCreds, adminSk));

      const initResult = contract.initialState(
        constructorContext,
        MIN_MONTHS,
        MIN_PAYMENT_SCORE,
        MAX_VIOLATIONS,
        MIN_COMPLETED_LEASES,
        adminPk,
        FUTURE_DEADLINE,
      );

      const context = makeCircuitContext(initResult.currentContractState);

      expect(() => {
        contract.circuits.verify_rental_history(context);
      }).toThrow(/commitment not found in registry/);
    });
  });

  describe('5. Credential Revocation Lifecycle', () => {
    it('Allows authority to revoke an issued credential', () => {
      const creds = {
        tenant_id: tenantId1,
        tenancy_months: 18n,
        payment_score: 95n,
        violations: 0n,
        completed_leases: 1n,
        lease_completed: true,
        credential_salt: credSalt1,
      };

      const contract = new Contract(makeWitnesses(creds, adminSk));

      const initResult = contract.initialState(
        constructorContext,
        MIN_MONTHS,
        MIN_PAYMENT_SCORE,
        MAX_VIOLATIONS,
        MIN_COMPLETED_LEASES,
        adminPk,
        FUTURE_DEADLINE,
      );

      const context = makeCircuitContext(initResult.currentContractState);

      // Issue credential
      const issueRes = contract.circuits.issue_credential(context, credCommitment1);

      // Revoke credential
      const revokeRes = contract.circuits.revoke_credential(issueRes.context, credCommitment1);
      expect(revokeRes).toBeDefined();

      const stateAfterRevoke = ledger(revokeRes.context.currentQueryContext.state);
      expect(stateAfterRevoke.revoked_credentials.member(credCommitment1)).toBe(true);

      // Verification of revoked credential must fail
      expect(() => {
        contract.circuits.verify_rental_history(revokeRes.context);
      }).toThrow(/has been revoked/);
    });

    it('Rejects unauthorized revocation attempts with invalid admin key', () => {
      const badSk = new Uint8Array(crypto.randomBytes(32));
      const creds = {
        tenant_id: tenantId1,
        tenancy_months: 18n,
        payment_score: 95n,
        violations: 0n,
        completed_leases: 1n,
        lease_completed: true,
        credential_salt: credSalt1,
      };

      const contract = new Contract(makeWitnesses(creds, badSk)); // Unauthorized key

      const initResult = contract.initialState(
        constructorContext,
        MIN_MONTHS,
        MIN_PAYMENT_SCORE,
        MAX_VIOLATIONS,
        MIN_COMPLETED_LEASES,
        adminPk,
        FUTURE_DEADLINE,
      );

      const context = makeCircuitContext(initResult.currentContractState);
      const issueRes = contract.circuits.issue_credential(context, credCommitment1);

      expect(() => {
        contract.circuits.revoke_credential(issueRes.context, credCommitment1);
      }).toThrow(/invalid authority secret key/);
    });
  });

  describe('6. Governance & Policy Configuration', () => {
    it('Allows authority to update verification policy criteria', () => {
      const contract = new Contract(makeWitnesses({
        tenant_id: tenantId1,
        tenancy_months: 14n,
        payment_score: 98n,
        violations: 0n,
        completed_leases: 1n,
        lease_completed: true,
        credential_salt: credSalt1,
      }, adminSk));

      const initResult = contract.initialState(
        constructorContext,
        MIN_MONTHS,
        MIN_PAYMENT_SCORE,
        MAX_VIOLATIONS,
        MIN_COMPLETED_LEASES,
        adminPk,
        FUTURE_DEADLINE,
      );

      const context = makeCircuitContext(initResult.currentContractState);

      const newMinMonths = 24n;
      const newMinScore = 95n;
      const newMaxViolations = 1n;
      const newMinLeases = 2n;
      const newDeadline = FUTURE_DEADLINE + 86400n;

      const updateRes = contract.circuits.update_policy(
        context,
        newMinMonths,
        newMinScore,
        newMaxViolations,
        newMinLeases,
        newDeadline,
        true,
      );

      const updatedLedger = ledger(updateRes.context.currentQueryContext.state);
      expect(updatedLedger.min_tenancy_months).toBe(24n);
      expect(updatedLedger.min_payment_score).toBe(95n);
      expect(updatedLedger.max_violations).toBe(1n);
      expect(updatedLedger.min_completed_leases).toBe(2n);
    });

    it('Rejects unauthorized policy update attempts', () => {
      const unauthorizedSk = new Uint8Array(crypto.randomBytes(32));
      const contract = new Contract(makeWitnesses({
        tenant_id: tenantId1,
        tenancy_months: 14n,
        payment_score: 98n,
        violations: 0n,
        completed_leases: 1n,
        lease_completed: true,
        credential_salt: credSalt1,
      }, unauthorizedSk));

      const initResult = contract.initialState(
        constructorContext,
        MIN_MONTHS,
        MIN_PAYMENT_SCORE,
        MAX_VIOLATIONS,
        MIN_COMPLETED_LEASES,
        adminPk,
        FUTURE_DEADLINE,
      );

      const context = makeCircuitContext(initResult.currentContractState);

      expect(() => {
        contract.circuits.update_policy(context, 24n, 95n, 1n, 2n, FUTURE_DEADLINE, true);
      }).toThrow(/invalid authority secret key/);
    });
  });
});
