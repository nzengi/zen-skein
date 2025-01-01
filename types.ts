export interface HashResult {
  hash: string;
  time: number;
  size: string;
  mode: string;
  entropy: number;
  timestamp: string;
  strength: 'LOW' | 'MEDIUM' | 'HIGH' | 'QUANTUM';
  performanceStats?: string;
  aiProtected?: boolean;
  blockchainOptimized?: boolean;
}

export interface HashStats {
  totalHashes: number;
  averageTime: number;
  fastestHash: number;
  strongestMode: string;
  popularMode: string;
}

export interface LicenseInfo {
  type: string;
  expiresAt: string;
  features: string[];
}