import { lz77Encode } from "./lz77";
import { BitWriter } from "./bitstream";
import { buildFrequencyMap, buildHuffmanTree, buildCodes } from "./huffman";

export function deflate(inputStr: string): Uint8Array {
  const input = new TextEncoder().encode(inputStr);

  // 1️⃣ LZ77
  const tokens = lz77Encode(input);

  // 2️⃣ Huffman
  const freq = buildFrequencyMap(tokens);
  const tree = buildHuffmanTree(freq);
  const codes = buildCodes(tree);

  // 3️⃣ Bit packing
  const writer = new BitWriter();

  for (const t of tokens) {
    if (t.type === "literal") {
      writer.writeBits(codes[`L${t.value}`]);
    } else {
      writer.writeBits(codes[`M${t.length},${t.distance}`]);
    }
  }

  return writer.finish();
}
