import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';

export interface RentalCredentialRecord {
  id: string;
  propertyLabel: string;
  issuerAddress: string;
  tenantAddress: string;
  issuedAt: number;
  status: 'active' | 'revoked';
  // Private values evaluated in ZK circuit
  tenancyMonths: number;
  paymentScore: number;
  violations: number;
  completedLeases: number;
  leaseCompleted: boolean;
  credentialSalt: string; // 32-byte hex
  commitment: string;     // 32-byte hex
  // Truly private attributes NEVER disclosed
  privateDetails: {
    previousAddress: string;
    exactRentMonthly: string;
    landlordName: string;
    landlordContact: string;
    leaseDocumentId: string;
  };
}

export interface VerificationRequest {
  id: string;
  verifierName: string;
  propertyTitle: string;
  propertyUnit: string;
  createdAt: number;
  status: 'pending' | 'verified' | 'rejected';
  minMonthsRequired: number;
  minPaymentScoreRequired: number;
  maxViolationsAllowed: number;
  minCompletedLeasesRequired: number;
  notes?: string;
  verifiedAt?: number;
  txHash?: string;
}

interface RentalDataContextType {
  credentials: RentalCredentialRecord[];
  requests: VerificationRequest[];
  addCredential: (cred: Omit<RentalCredentialRecord, 'id' | 'issuedAt' | 'status'>) => RentalCredentialRecord;
  revokeCredentialStatus: (commitment: string) => void;
  createRequest: (req: Omit<VerificationRequest, 'id' | 'createdAt' | 'status'>) => VerificationRequest;
  fulfillRequest: (requestId: string, txHash: string) => void;
  resetDemoData: () => void;
}

const CREDENTIALS_STORAGE_KEY = 'proofrent_tenant_credentials';
const REQUESTS_STORAGE_KEY = 'proofrent_verification_requests';

// Realistic sample credentials so the user can immediately test selective disclosure
const DEFAULT_CREDENTIALS: RentalCredentialRecord[] = [
  {
    id: 'cred_cedar_ridge_01',
    propertyLabel: 'Cedar Ridge Residences — Unit 412',
    issuerAddress: '0x9a4f21b7c8e9014238e12d981c2049b581e92049b581e92049b581e92049b581',
    tenantAddress: '0x10b9812049b581e92049b581e92049b581e92049b581e92049b581e92049b581',
    issuedAt: Date.now() - 45 * 24 * 60 * 60 * 1000,
    status: 'active',
    tenancyMonths: 18,
    paymentScore: 98,
    violations: 0,
    completedLeases: 1,
    leaseCompleted: true,
    credentialSalt: '3f7a19c84e201b59a68c049b18d2039485720194857201948572019485720194',
    commitment: '7b2a9f4c10293848572019485720194857201948572019485720194857201948',
    privateDetails: {
      previousAddress: '412 Cedar Ridge Pkwy, Austin, TX 78704',
      exactRentMonthly: '$2,450 / month',
      landlordName: 'Highland Property Management Corp',
      landlordContact: 'leasing@highlandprop-tx.com',
      leaseDocumentId: 'DOC-TX-2024-88419-SECURE',
    },
  },
  {
    id: 'cred_maple_court_02',
    propertyLabel: 'Maple Court Flats — Unit 2B',
    issuerAddress: '0x38e12d981c2049b581e92049b581e92049b581e92049b581e92049b581e92049',
    tenantAddress: '0x10b9812049b581e92049b581e92049b581e92049b581e92049b581e92049b581',
    issuedAt: Date.now() - 400 * 24 * 60 * 60 * 1000,
    status: 'active',
    tenancyMonths: 24,
    paymentScore: 100,
    violations: 0,
    completedLeases: 1,
    leaseCompleted: true,
    credentialSalt: '9c4f102938485720194857201948572019485720194857201948572019485720',
    commitment: '1a8c9e4029384857201948572019485720194857201948572019485720194857',
    privateDetails: {
      previousAddress: '88 Maple Court, Seattle, WA 98101',
      exactRentMonthly: '$2,800 / month',
      landlordName: 'Cascade Living LLC',
      landlordContact: 'ops@cascadeliving-nw.com',
      leaseDocumentId: 'DOC-WA-2023-11029-SECURE',
    },
  },
];

const DEFAULT_REQUESTS: VerificationRequest[] = [
  {
    id: 'req_silverstone_01',
    verifierName: 'Silverstone Residential',
    propertyTitle: 'The Grove at Westlake',
    propertyUnit: 'Apt 504',
    createdAt: Date.now() - 2 * 24 * 60 * 60 * 1000,
    status: 'pending',
    minMonthsRequired: 12,
    minPaymentScoreRequired: 90,
    maxViolationsAllowed: 0,
    minCompletedLeasesRequired: 1,
    notes: 'Standard lease application background check for applicant rental track record.',
  },
  {
    id: 'req_beacon_hill_02',
    verifierName: 'Beacon Urban Properties',
    propertyTitle: 'Beacon Loft 14A',
    propertyUnit: 'Penthouse 14A',
    createdAt: Date.now() - 5 * 24 * 60 * 60 * 1000,
    status: 'pending',
    minMonthsRequired: 18,
    minPaymentScoreRequired: 95,
    maxViolationsAllowed: 0,
    minCompletedLeasesRequired: 1,
    notes: 'Premium lease verification requires 18+ months past verifiable tenure.',
  },
];

const RentalDataContext = createContext<RentalDataContextType | null>(null);

export function RentalDataProvider({ children }: { children: ReactNode }) {
  const [credentials, setCredentials] = useState<RentalCredentialRecord[]>(() => {
    try {
      const stored = localStorage.getItem(CREDENTIALS_STORAGE_KEY);
      return stored ? JSON.parse(stored) : DEFAULT_CREDENTIALS;
    } catch {
      return DEFAULT_CREDENTIALS;
    }
  });

  const [requests, setRequests] = useState<VerificationRequest[]>(() => {
    try {
      const stored = localStorage.getItem(REQUESTS_STORAGE_KEY);
      return stored ? JSON.parse(stored) : DEFAULT_REQUESTS;
    } catch {
      return DEFAULT_REQUESTS;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(CREDENTIALS_STORAGE_KEY, JSON.stringify(credentials));
    } catch (e) {
      console.error('Failed to save credentials to localStorage', e);
    }
  }, [credentials]);

  useEffect(() => {
    try {
      localStorage.setItem(REQUESTS_STORAGE_KEY, JSON.stringify(requests));
    } catch (e) {
      console.error('Failed to save requests to localStorage', e);
    }
  }, [requests]);

  const addCredential = useCallback((data: Omit<RentalCredentialRecord, 'id' | 'issuedAt' | 'status'>) => {
    const newRecord: RentalCredentialRecord = {
      ...data,
      id: `cred_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      issuedAt: Date.now(),
      status: 'active',
    };
    setCredentials(prev => [newRecord, ...prev]);
    return newRecord;
  }, []);

  const revokeCredentialStatus = useCallback((commitment: string) => {
    setCredentials(prev =>
      prev.map(c => (c.commitment === commitment ? { ...c, status: 'revoked' } : c))
    );
  }, []);

  const createRequest = useCallback((data: Omit<VerificationRequest, 'id' | 'createdAt' | 'status'>) => {
    const newReq: VerificationRequest = {
      ...data,
      id: `req_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      createdAt: Date.now(),
      status: 'pending',
    };
    setRequests(prev => [newReq, ...prev]);
    return newReq;
  }, []);

  const fulfillRequest = useCallback((requestId: string, txHash: string) => {
    setRequests(prev =>
      prev.map(r =>
        r.id === requestId
          ? { ...r, status: 'verified', verifiedAt: Date.now(), txHash }
          : r
      )
    );
  }, []);

  const resetDemoData = useCallback(() => {
    setCredentials(DEFAULT_CREDENTIALS);
    setRequests(DEFAULT_REQUESTS);
  }, []);

  return (
    <RentalDataContext.Provider
      value={{
        credentials,
        requests,
        addCredential,
        revokeCredentialStatus,
        createRequest,
        fulfillRequest,
        resetDemoData,
      }}
    >
      {children}
    </RentalDataContext.Provider>
  );
}

export function useRentalData() {
  const context = useContext(RentalDataContext);
  if (!context) {
    throw new Error('useRentalData must be used within a RentalDataProvider');
  }
  return context;
}
