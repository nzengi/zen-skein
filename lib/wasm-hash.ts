export interface Skein3Module {
  _malloc(size: number): number;
  _free(ptr: number): void;
  _create_hash_context(mode: string): number;
  _update_hash(ctx: number, input: number, length: number): void;
  _get_hash(ctx: number): string;
  _get_performance_stats(ctx: number): string;
  _destroy_hash_context(ctx: number): void;
}

declare global {
  interface Window {
    createSkein3Module: () => Promise<Skein3Module>;
  }
}

let wasmModule: Skein3Module | null = null;

export async function initWasm(): Promise<void> {
  // Server-side handling
  if (typeof window === 'undefined') {
    const { mockWasm } = await import('./mock-wasm')
    wasmModule = mockWasm
    return
  }

  if (!wasmModule) {
    try {
      wasmModule = await window.createSkein3Module()
    } catch (error) {
      console.error('Failed to load WebAssembly:', error)
      throw new Error('Failed to initialize hash module')
    }
  }
}

export interface HashDetails {
  hash: string;
  performanceStats: string;
  aiProtected?: boolean;
  blockchainOptimized?: boolean;
  time: number;
}

export async function computeHash(input: string, mode: string): Promise<HashDetails> {
  if (!wasmModule) {
    await initWasm();
  }

  const encoder = new TextEncoder();
  const inputArray = encoder.encode(input);
  
  const ptr = wasmModule!._malloc(inputArray.length);
  const heap = new Uint8Array((wasmModule as any).HEAPU8.buffer, ptr, inputArray.length);
  heap.set(inputArray);
  
  const ctx = wasmModule!._create_hash_context(mode);
  wasmModule!._update_hash(ctx, ptr, inputArray.length);
  
  const result = {
    hash: wasmModule!._get_hash(ctx),
    performanceStats: wasmModule!._get_performance_stats(ctx),
    time: 0 // Will be set by C++
  };
  
  wasmModule!._destroy_hash_context(ctx);
  wasmModule!._free(ptr);
  
  return result;
} 