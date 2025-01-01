import { NextApiRequest, NextApiResponse } from 'next'
import type { LicenseInfo } from '../../types'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<LicenseInfo>
) {
  const license: LicenseInfo = {
    type: 'DEMO',
    features: ['STANDARD', 'AI'],
    requestsRemaining: 100,
    expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
  }
  
  res.status(200).json(license)
} 