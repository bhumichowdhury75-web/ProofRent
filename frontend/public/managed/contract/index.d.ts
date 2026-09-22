import type * as __compactRuntime from '@midnight-ntwrk/compact-runtime';

export type Witnesses<PS> = {
  rental_credential(context: __compactRuntime.WitnessContext<Ledger, PS>): [PS, { tenant_id: Uint8Array,
                                                                                  tenancy_months: bigint,
                                                                                  payment_score: bigint,
                                                                                  violations: bigint,
                                                                                  completed_leases: bigint,
                                                                                  lease_completed: boolean,
                                                                                  credential_salt: Uint8Array
                                                                                }];
  admin_secret_key(context: __compactRuntime.WitnessContext<Ledger, PS>): [PS, Uint8Array];
}

export type ImpureCircuits<PS> = {
  verify_rental_history(context: __compactRuntime.CircuitContext<PS>): __compactRuntime.CircuitResults<PS, []>;
  issue_credential(context: __compactRuntime.CircuitContext<PS>,
                   commitment_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  revoke_credential(context: __compactRuntime.CircuitContext<PS>,
                    commitment_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  update_policy(context: __compactRuntime.CircuitContext<PS>,
                new_min_months_0: bigint,
                new_min_score_0: bigint,
                new_max_violations_0: bigint,
                new_min_completed_leases_0: bigint,
                new_deadline_0: bigint,
                new_active_status_0: boolean): __compactRuntime.CircuitResults<PS, []>;
}

export type ProvableCircuits<PS> = {
  verify_rental_history(context: __compactRuntime.CircuitContext<PS>): __compactRuntime.CircuitResults<PS, []>;
  issue_credential(context: __compactRuntime.CircuitContext<PS>,
                   commitment_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  revoke_credential(context: __compactRuntime.CircuitContext<PS>,
                    commitment_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  update_policy(context: __compactRuntime.CircuitContext<PS>,
                new_min_months_0: bigint,
                new_min_score_0: bigint,
                new_max_violations_0: bigint,
                new_min_completed_leases_0: bigint,
                new_deadline_0: bigint,
                new_active_status_0: boolean): __compactRuntime.CircuitResults<PS, []>;
}

export type PureCircuits = {
  adminPublicKey(sk_0: Uint8Array): Uint8Array;
  credentialCommitment(tenant_id_0: Uint8Array, salt_0: Uint8Array): Uint8Array;
  makeNullifier(tenant_id_0: Uint8Array, commitment_0: Uint8Array): Uint8Array;
}

export type Circuits<PS> = {
  verify_rental_history(context: __compactRuntime.CircuitContext<PS>): __compactRuntime.CircuitResults<PS, []>;
  issue_credential(context: __compactRuntime.CircuitContext<PS>,
                   commitment_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  revoke_credential(context: __compactRuntime.CircuitContext<PS>,
                    commitment_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  update_policy(context: __compactRuntime.CircuitContext<PS>,
                new_min_months_0: bigint,
                new_min_score_0: bigint,
                new_max_violations_0: bigint,
                new_min_completed_leases_0: bigint,
                new_deadline_0: bigint,
                new_active_status_0: boolean): __compactRuntime.CircuitResults<PS, []>;
  adminPublicKey(context: __compactRuntime.CircuitContext<PS>, sk_0: Uint8Array): __compactRuntime.CircuitResults<PS, Uint8Array>;
  credentialCommitment(context: __compactRuntime.CircuitContext<PS>,
                       tenant_id_0: Uint8Array,
                       salt_0: Uint8Array): __compactRuntime.CircuitResults<PS, Uint8Array>;
  makeNullifier(context: __compactRuntime.CircuitContext<PS>,
                tenant_id_0: Uint8Array,
                commitment_0: Uint8Array): __compactRuntime.CircuitResults<PS, Uint8Array>;
}

export type Ledger = {
  readonly min_tenancy_months: bigint;
  readonly min_payment_score: bigint;
  readonly max_violations: bigint;
  readonly min_completed_leases: bigint;
  readonly admin: Uint8Array;
  readonly is_active: boolean;
  readonly total_verifications: bigint;
  readonly total_credentials: bigint;
  readonly deadline: bigint;
  credential_registry: {
    isEmpty(): boolean;
    size(): bigint;
    member(elem_0: Uint8Array): boolean;
    [Symbol.iterator](): Iterator<Uint8Array>
  };
  revoked_credentials: {
    isEmpty(): boolean;
    size(): bigint;
    member(elem_0: Uint8Array): boolean;
    [Symbol.iterator](): Iterator<Uint8Array>
  };
  nullifiers: {
    isEmpty(): boolean;
    size(): bigint;
    member(elem_0: Uint8Array): boolean;
    [Symbol.iterator](): Iterator<Uint8Array>
  };
}

export type ContractReferenceLocations = any;

export declare const contractReferenceLocations : ContractReferenceLocations;

export declare class Contract<PS = any, W extends Witnesses<PS> = Witnesses<PS>> {
  witnesses: W;
  circuits: Circuits<PS>;
  impureCircuits: ImpureCircuits<PS>;
  provableCircuits: ProvableCircuits<PS>;
  constructor(witnesses: W);
  initialState(context: __compactRuntime.ConstructorContext<PS>,
               initial_min_months_0: bigint,
               initial_min_score_0: bigint,
               initial_max_violations_0: bigint,
               initial_min_completed_leases_0: bigint,
               initial_admin_0: Uint8Array,
               initial_deadline_0: bigint): __compactRuntime.ConstructorResult<PS>;
}

export declare function ledger(state: __compactRuntime.StateValue | __compactRuntime.ChargedState): Ledger;
export declare const pureCircuits: PureCircuits;
