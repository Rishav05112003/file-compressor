export type HuffNode = {
  symbol?: string;
  freq: number;
  left?: HuffNode;
  right?: HuffNode;
};

export function buildFrequencyMap(tokens: any[]) {
  const map = new Map<string, number>();

  for (const t of tokens) {
    if (t.type === "literal") {
      const key = `L${t.value}`;
      map.set(key, (map.get(key) || 0) + 1);
    } else {
      const key = `M${t.length},${t.distance}`;
      map.set(key, (map.get(key) || 0) + 1);
    }
  }
  return map;
}

export function buildHuffmanTree(freq: Map<string, number>): HuffNode {
  let nodes: HuffNode[] = [];

  freq.forEach((f, symbol) => {
    nodes.push({ symbol, freq: f });
  });

  while (nodes.length > 1) {
    nodes.sort((a, b) => a.freq - b.freq);

    const left = nodes.shift()!;
    const right = nodes.shift()!;

    nodes.push({
      freq: left.freq + right.freq,
      left,
      right
    });
  }

  return nodes[0];
}

export function buildCodes(
  node: HuffNode,
  prefix = "",
  codes: Record<string, string> = {}
) {
  if (!node.left && !node.right) {
    codes[node.symbol!] = prefix;
    return codes;
  }

  buildCodes(node.left!, prefix + "0", codes);
  buildCodes(node.right!, prefix + "1", codes);
  return codes;
}
