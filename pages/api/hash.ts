import { NextApiRequest, NextApiResponse } from 'next'
import { computeHash } from '../../lib/wasm-hash'
import type { HashResult } from '../../types'

const calculateEntropy = (input: string): number => {
  const freq: { [key: string]: number } = {}
  for (let char of input) {
    freq[char] = (freq[char] || 0) + 1
  }
  
  let entropy = 0
  const len = input.length
  for (let count of Object.values(freq)) {
    const p = count / len
    entropy -= p * Math.log2(p)
  }
  return entropy
}

function getHashStrength(mode: string): 'LOW' | 'MEDIUM' | 'HIGH' | 'QUANTUM' {
  switch (mode) {
    case 'QUANTUM':
      return 'QUANTUM'
    case 'BLOCKCHAIN':
      return 'HIGH'
    case 'AI':
      return 'MEDIUM'
    default:
      return 'LOW'
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { input, mode } = req.body

    if (!input || typeof input !== 'string') {
      return res.status(400).json({ error: 'Invalid input' })
    }

    const hashDetails = await computeHash(input, mode)
    if (!hashDetails) {
      throw new Error('Hash computation failed')
    }

    const result: HashResult = {
      hash: hashDetails.hash,
      time: hashDetails.time || 0,
      size: mode === 'STANDARD' ? '512 bits' : '1024 bits',
      mode,
      entropy: calculateEntropy(input),
      strength: getHashStrength(mode),
      timestamp: new Date().toISOString(),
      performanceStats: hashDetails.performanceStats,
      aiProtected: hashDetails.aiProtected,
      blockchainOptimized: hashDetails.blockchainOptimized
    }

    res.status(200).json(result)
  } catch (error) {
    console.error('Hash API Error:', error)
    res.status(500).json({ error: 'Hash calculation failed' })
  }
} 