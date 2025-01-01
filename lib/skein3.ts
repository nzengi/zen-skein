interface Skein3WASM {
  hash: (input: string, mode: string) => string;
  // Diğer metodlar...
}

let skein3: any = null;

export async function initSkein3() {
  if (!skein3) {
    // Use dynamic import for WebAssembly
    const response = await fetch('/skein3.wasm');
    const wasmBinary = await response.arrayBuffer();
    skein3 = await WebAssembly.instantiate(wasmBinary);
  }
  return skein3.instance;
}

export function hash(input: string, mode: string): string {
  if (!skein3) throw new Error('Skein3 WASM not initialized');
  return skein3.hash(input, mode);
} 