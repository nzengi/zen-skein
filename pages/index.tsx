// frontend/pages/index.tsx
import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import type { HashResult, HashStats, LicenseInfo } from '../types'
import { initWasm } from '../lib/wasm-hash'

export default function Home() {
  const [input, setInput] = useState('')
  const [mode, setMode] = useState('STANDARD')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<HashResult | null>(null)
  const [error, setError] = useState('')
  const [history, setHistory] = useState<HashResult[]>([])
  const [stats, setStats] = useState<HashStats | null>(null)
  const [license, setLicense] = useState<LicenseInfo | null>(null)

  const calculateHash = async () => {
    try {
      setLoading(true)
      setError('')
      
      const response = await fetch('/api/hash', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input, mode })
      })

      if (!response.ok) {
        throw new Error('Hash calculation failed')
      }

      const data = await response.json()
      setResult(data)
      setHistory([...history, data]) // Yeni sonucu geçmişe ekle
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  // İstatistikleri yükle
  useEffect(() => {
    const loadStats = async () => {
      const response = await fetch('/api/stats')
      const data = await response.json()
      setStats(data)
    }
    loadStats()
  }, [])

  useEffect(() => {
    // Load WebAssembly module
    const script = document.createElement('script')
    script.src = '/skein3.js'
    script.async = true
    script.onload = () => {
      initWasm().catch(console.error)
    }
    document.body.appendChild(script)
  }, [])

  return (
    <>
      <Head>
        <title>Skein3 Hash Demo</title>
        <meta name="description" content="Try Skein3 hash algorithm online" />
      </Head>

      <main className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          <h1 className="text-4xl font-bold mb-8 text-center">
            Skein3 Hash Demo
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Hash Calculation Form */}
            <div className="bg-gray-800 rounded-lg p-6">
              <div className="mb-4">
                <label className="block mb-2">Hash Mode</label>
                <select
                  value={mode}
                  onChange={(e) => setMode(e.target.value)}
                  className="w-full p-2 rounded bg-gray-700 text-white"
                >
                  <option value="STANDARD">Standard Mode</option>
                  <option value="AI">AI-Optimized Mode</option>
                  <option value="BLOCKCHAIN">Blockchain Mode</option>
                  <option value="QUANTUM">Quantum-Resistant Mode</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block mb-2">Input Text</label>
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Enter text to hash..."
                  className="w-full h-32 p-2 rounded bg-gray-700 text-white"
                />
              </div>

              <button
                onClick={calculateHash}
                disabled={loading || !input}
                className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 rounded disabled:opacity-50"
              >
                {loading ? 'Calculating...' : 'Calculate Hash'}
              </button>

              {error && (
                <div className="mt-4 p-4 bg-red-500/20 border border-red-500 rounded">
                  {error}
                </div>
              )}

              {result && (
                <div className="mt-4 p-4 bg-gray-900 rounded">
                  <p className="font-mono break-all">{result.hash}</p>
                  <div className="mt-2 text-sm text-gray-400">
                    <p>Time: {result.time}ms | Size: {result.size}</p>
                    {result.performanceStats && (
                      <p>Hardware Support: {result.performanceStats}</p>
                    )}
                    {result.aiProtected && (
                      <p className="text-green-400">AI Protection Active</p>
                    )}
                    {result.blockchainOptimized && (
                      <p className="text-blue-400">Blockchain Optimized</p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Statistics */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4">Hash Statistics</h2>
              {stats && (
                <div className="space-y-2">
                  <p>Total Hashes: {stats.totalHashes}</p>
                  <p>Average Time: {stats.averageTime}ms</p>
                  <p>Fastest: {stats.fastestHash}ms</p>
                  <p>Strongest Mode: {stats.strongestMode}</p>
                  <p>Popular Mode: {stats.popularMode}</p>
                </div>
              )}
            </div>

            {/* History */}
            <div className="col-span-2 bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4">Hash History</h2>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      <th className="text-left p-2 border-b border-gray-700">Time</th>
                      <th className="text-left p-2 border-b border-gray-700">Hash</th>
                      <th className="text-left p-2 border-b border-gray-700">Mode</th>
                      <th className="text-left p-2 border-b border-gray-700">Duration</th>
                      <th className="text-left p-2 border-b border-gray-700">Entropy</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.map((item, index) => (
                      <tr key={index} className="hover:bg-gray-700">
                        <td className="p-2 border-b border-gray-800">{new Date(item.timestamp).toLocaleString()}</td>
                        <td className="p-2 border-b border-gray-800 font-mono">{item.hash.substring(0, 20)}...</td>
                        <td className="p-2 border-b border-gray-800">{item.mode}</td>
                        <td className="p-2 border-b border-gray-800">{item.time}ms</td>
                        <td className="p-2 border-b border-gray-800">{item.entropy.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}