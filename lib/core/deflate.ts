import { lz77Encode } from "./lz77";
import { BitWriter } from "./bitstream";
import { buildFrequencyMap, buildHuffmanTree, buildCodes, serializeTree } from "./huffman";

// Magic "DFL8"
const MAGIC = [0x44, 0x46, 0x4C, 0x38]; 

export function deflate(inputStr: string): Uint8Array {
  const input = new TextEncoder().encode(inputStr);

  // 1. LZ77 Compression
  const tokens = lz77Encode(input);

  // 2. Build Tree & Codes
  const freqMap = buildFrequencyMap(tokens);
  
  // Edge case: Empty file or single char file
  if (freqMap.size === 0) return new Uint8Array(MAGIC); 
  
  const tree = buildHuffmanTree(freqMap);
  const codes = buildCodes(tree);

  // 3. Serialize Tree (The reliable string representation)
  const treeString = serializeTree(tree);
  const treeBytes = new TextEncoder().encode(treeString);

  const writer = new BitWriter();

  // --- HEADER GENERATION ---
  // A. Magic Bytes
  MAGIC.forEach(b => writer.writeByte(b));

  // B. Tree String Length (4 bytes)
  const len = treeBytes.length;
  writer.writeByte((len >>> 24) & 0xff);
  writer.writeByte((len >>> 16) & 0xff);
  writer.writeByte((len >>> 8) & 0xff);
  writer.writeByte(len & 0xff);

  // C. Tree String Data
  for (let b of treeBytes) {
    writer.writeByte(b);
  }

  // --- BODY GENERATION ---
  for (const t of tokens) {
    const key = t.type === "literal" ? `L${t.value}` : `M${t.length},${t.distance}`;
    writer.writeBits(codes[key]);
  }

  return writer.finish();
}