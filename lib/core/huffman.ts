export type HuffNode = {
  symbol?: string; // e.g. "L65" for literal 'A', or "M3,10" for match
  freq: number;
  left?: HuffNode;
  right?: HuffNode;
};

// --- STANDARD BUILDER FUNCTIONS ---

export function buildFrequencyMap(tokens: any[]) {
  const map = new Map<string, number>();
  for (const t of tokens) {
    const key = t.type === "literal" ? `L${t.value}` : `M${t.length},${t.distance}`;
    map.set(key, (map.get(key) || 0) + 1);
  }
  return map;
}

export function buildHuffmanTree(freq: Map<string, number>): HuffNode {
  let nodes: HuffNode[] = [];
  freq.forEach((f, symbol) => nodes.push({ symbol, freq: f }));

  // Deterministic Sort (Crucial for consistent tree building)
  while (nodes.length > 1) {
    nodes.sort((a, b) => {
        if (a.freq !== b.freq) return a.freq - b.freq;
        return (a.symbol || "").localeCompare(b.symbol || "");
    });
    
    const left = nodes.shift()!;
    const right = nodes.shift()!;
    
    nodes.push({
      freq: left.freq + right.freq,
      left,
      right,
      symbol: "" // Internal nodes have no symbol
    });
  }
  return nodes[0];
}

export function buildCodes(node: HuffNode, prefix = "", codes: Record<string, string> = {}) {
  if (!node.left && !node.right) {
    codes[node.symbol!] = prefix;
    return codes;
  }
  if (node.left) buildCodes(node.left, prefix + "0", codes);
  if (node.right) buildCodes(node.right, prefix + "1", codes);
  return codes;
}

// --- NEW: TREE SERIALIZATION (The Fix) ---

// Convert the tree shape into a string string
// '0' = Branch, '1' = Leaf (followed by symbol and delimiter)
export function serializeTree(node: HuffNode): string {
  if (!node.left && !node.right) {
    return "1" + node.symbol + "|"; // Leaf
  }
  return "0" + serializeTree(node.left!) + serializeTree(node.right!); // Branch
}

// Rebuild the tree from the string
let parseIndex = 0;
export function deserializeTree(str: string): HuffNode {
  const type = str[parseIndex++];
  
  if (type === "1") {
    // Leaf: Read until '|'
    let symbol = "";
    while (str[parseIndex] !== "|") {
      symbol += str[parseIndex++];
    }
    parseIndex++; // Skip delimiter
    return { freq: 0, symbol };
  } else {
    // Branch: Recurse
    const left = deserializeTree(str);
    const right = deserializeTree(str);
    return { freq: 0, left, right };
  }
}

export function resetDeserializeIndex() {
  parseIndex = 0;
}