export interface HashResult {
  hash: string
  time: number
  size: string
  mode: string
  entropy: number
  strength: 'LOW' | 'MEDIUM' | 'HIGH' | 'QUANTUM'
  timestamp: string
}

export interface HashStats {
  totalHashes: number
  averageTime: number
  fastestHash: number
  strongestMode: string
  popularMode: string
}

export interface LicenseInfo {
  type: 'DEMO' | 'BASIC' | 'ENTERPRISE'
  features: string[]
  requestsRemaining: number
  expiryDate: string
} 