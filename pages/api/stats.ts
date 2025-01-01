import { NextApiRequest, NextApiResponse } from 'next'
import type { HashStats } from '../../types'

// Demo için sabit istatistikler
const stats: HashStats = {
  totalHashes: 1000,
  averageTime: 45,
  fastestHash: 12,
  strongestMode: 'QUANTUM',
  popularMode: 'BLOCKCHAIN'
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<HashStats>
) {
  res.status(200).json(stats)
} 