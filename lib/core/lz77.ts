export type LZToken =
  | { type: "literal"; value: number }
  | { type: "match"; distance: number; length: number };

export function lz77Encode(
  input: Uint8Array,
  windowSize = 1024,
  minMatch = 3,
  maxMatch = 258
): LZToken[] {
  const tokens: LZToken[] = [];
  let pos = 0;

  while (pos < input.length) {
    let bestLen = 0;
    let bestDist = 0;

    const start = Math.max(0, pos - windowSize);

    for (let i = start; i < pos; i++) {
      let len = 0;

      while (
        len < maxMatch &&
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
      tokens.push({ type: "match", distance: bestDist, length: bestLen });
      pos += bestLen;
    } else {
      tokens.push({ type: "literal", value: input[pos] });
      pos++;
    }
  }

  return tokens;
}
