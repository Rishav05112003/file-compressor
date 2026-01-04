import { BitReader } from "./bitstream";
import { deserializeTree, buildCodes, resetDeserializeIndex } from "./huffman";

const MAGIC = [0x44, 0x46, 0x4C, 0x38];

export function inflate(compressedData: Uint8Array): string {
  const reader = new BitReader(compressedData);

  // 1. Check Magic Bytes
  for (let i = 0; i < 4; i++) {
    if (reader.readByte() !== MAGIC[i]) {
       // Graceful fail for empty/invalid files
       if (compressedData.length === 0) return ""; 
       throw new Error("Invalid header");
    }
  }
  
  // Edge case: Just magic bytes = empty file
  if (compressedData.length === 4) return "";

  // 2. Read Tree Length
  let treeLen = 0;
  for (let i = 0; i < 4; i++) {
     const b = reader.readByte();
     if (b === null) throw new Error("Unexpected EOF");
     treeLen = (treeLen << 8) | b;
  }

  // 3. Read Tree String
  const headerStart = 8; // 4 magic + 4 len
  const headerEnd = headerStart + treeLen;
  
  const treeBytes = compressedData.slice(headerStart, headerEnd);
  const treeString = new TextDecoder().decode(treeBytes);

  // 4. Rebuild Logic (Exactly like reference code)
  resetDeserializeIndex();
  const tree = deserializeTree(treeString);
  const codeMap = buildCodes(tree);

  // Create lookup map: "0101" -> "L65"
  const reverseCodes: Record<string, string> = {};
  Object.entries(codeMap).forEach(([symbol, bits]) => {
    reverseCodes[bits] = symbol;
  });

  // 5. Decode Body
  reader.seek(headerEnd); 
  
  const output: number[] = [];
  let currentBits = "";
  
  while (true) {
    const bit = reader.readBit();
    if (bit === null) break;

    currentBits += String(bit); // Append bit

    if (reverseCodes[currentBits]) {
      const token = reverseCodes[currentBits];
      
      if (token.startsWith("L")) {
        // Literal
        const val = parseInt(token.substring(1));
        output.push(val);
      } else {
        // Match (LZ77)
        const parts = token.substring(1).split(",");
        const len = parseInt(parts[0]);
        const dist = parseInt(parts[1]);
        
        const startIdx = output.length - dist;
        for (let i = 0; i < len; i++) {
           output.push(output[startIdx + i]);
        }
      }
      currentBits = ""; // Reset for next token
    }
  }

  return new TextDecoder().decode(new Uint8Array(output));
}