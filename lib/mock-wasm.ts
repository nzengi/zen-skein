import type { Skein3Module } from './wasm-hash'
import { createHash } from 'crypto'

// Mock heap for server-side
const mockHeap = new Uint8Array(1024);

export const mockWasm: Skein3Module = {
  _malloc(size: number) { return 0 },
  _free(ptr: number) {},
  _create_hash_context(mode: string) { return 0 },
  _update_hash(ctx: number, input: number, length: number) {
    // Store input for hashing
    mockHeap.set(new Uint8Array(length), input);
  },
  _get_hash(ctx: number) {
    const hash = createHash('sha256')
    hash.update(Buffer.from(mockHeap))
    return hash.digest('hex')
  },
  _get_performance_stats(ctx: number) {
    return 'AES:No AVX2:No (Server-side)'
  },
  _destroy_hash_context(ctx: number) {},
  // Add HEAPU8 for server-side compatibility
  HEAPU8: { buffer: mockHeap.buffer }
} 