export type LZToken =
  | { type: "literal"; value: number }
  | { type: "match"; distance: number; length: number };

export function lz77Encode(input: Uint8Array): LZToken[] {
  const tokens: LZToken[] = [];
  let pos = 0;
  const windowSize = 2048; // Moderate window
  const minMatch = 3;

  while (pos < input.length) {
    let bestLen = 0;
    let bestDist = 0;
    const start = Math.max(0, pos - windowSize);

    // Brute force search (Robust and Simple)
    for (let i = start; i < pos; i++) {
      let len = 0;
      while (
         pos + len < input.length && 
         len < 255 &&
         input[i + len] === input[pos + len]
      ) {
        len++;
      }

      if (len >= minMatch && len > bestLen) {
        bestLen = len;
        bestDist = pos - i;
      }
    }

    if (bestLen >= minMatch) {
      tokens.push({ type: "match", length: bestLen, distance: bestDist });
      pos += bestLen;
    } else {
      tokens.push({ type: "literal", value: input[pos] });
      pos++;
    }
  }
  return tokens;
}