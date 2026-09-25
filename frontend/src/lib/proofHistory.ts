export interface DisclosedClaimSummary {
  label: string;
  requirement: string;
  satisfied: boolean;
}

export interface VerificationHistoryItem {
  id: string;
  timestamp: number;
  txId?: string;
  result: 'verified' | 'failed';
  propertyTitle?: string;
  verifierName?: string;
  disclosedClaims: DisclosedClaimSummary[];
  protectedClaims: string[];
  nullifierHex?: string;
  notes?: string;
}

const STORAGE_KEY = 'proofrent_verification_history';

export function getProofHistory(): VerificationHistoryItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveProofItem(item: VerificationHistoryItem): void {
  try {
    const history = getProofHistory();
    const updated = [item, ...history.filter(h => h.id !== item.id)].slice(0, 50);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save verification item to history', e);
  }
}

export function clearProofHistory(): void {
  localStorage.removeItem(STORAGE_KEY);
}
