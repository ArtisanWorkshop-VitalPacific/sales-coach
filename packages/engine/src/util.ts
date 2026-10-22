export const clamp = (n: number, lo = 0, hi = 100) => Math.max(lo, Math.min(hi, n));

export const wordCount = (s: string) => (s.trim() ? s.trim().split(/\s+/).length : 0);

/** Deterministic PRNG (mulberry32). Same seed, same session behavior. */
export function createRng(seed: number) {
  let a = seed >>> 0;
  const next = () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  return {
    next,
    /** Current internal state, for serializing a session between requests. */
    getState: () => a,
    chance: (p: number) => next() < p,
    pick<T>(items: readonly T[]): T | undefined {
      if (items.length === 0) return undefined;
      return items[Math.floor(next() * items.length)];
    },
    weighted<T>(items: readonly { item: T; weight: number }[]): T | undefined {
      const total = items.reduce((s, x) => s + Math.max(0, x.weight), 0);
      if (total <= 0) return undefined;
      let r = next() * total;
      for (const x of items) {
        r -= Math.max(0, x.weight);
        if (r <= 0) return x.item;
      }
      return items[items.length - 1]?.item;
    },
  };
}
export type Rng = ReturnType<typeof createRng>;

export const newId = (prefix: string) =>
  `${prefix}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;

/** Spoken dollar amounts: 1890 -> "eighteen ninety". Used by the scripted voice. */
export function sayDollars(n: number): string {
  const ones = [
    '',
    'one',
    'two',
    'three',
    'four',
    'five',
    'six',
    'seven',
    'eight',
    'nine',
    'ten',
    'eleven',
    'twelve',
    'thirteen',
    'fourteen',
    'fifteen',
    'sixteen',
    'seventeen',
    'eighteen',
    'nineteen',
  ];
  const tens = [
    '',
    '',
    'twenty',
    'thirty',
    'forty',
    'fifty',
    'sixty',
    'seventy',
    'eighty',
    'ninety',
  ];
  const two = (x: number): string =>
    x < 20 ? ones[x]! : `${tens[Math.floor(x / 10)]}${x % 10 ? `-${ones[x % 10]}` : ''}`;
  if (n >= 1000 && n < 10000 && n % 100 !== 0 && Math.floor(n / 100) % 10 !== 0) {
    return `${two(Math.floor(n / 100))} ${two(n % 100)}`;
  }
  if (n >= 1000) {
    const th = Math.floor(n / 1000);
    const rest = n % 1000;
    return `${two(th)} thousand${rest ? ` ${rest >= 100 ? `${ones[Math.floor(rest / 100)]} hundred ${two(rest % 100)}`.trim() : two(rest)}` : ''}`;
  }
  if (n >= 100) return `${ones[Math.floor(n / 100)]} hundred${n % 100 ? ` ${two(n % 100)}` : ''}`;
  return two(n);
}

/** Parse dollar amounts out of tech speech: "$1,890", "1890 dollars", "eighteen ninety". */
export function extractDollarAmounts(text: string, min = 50): number[] {
  const out: number[] = [];
  const re = /\$\s?(\d{1,3}(?:,\d{3})+|\d+)(?:\.\d{2})?|\b(\d{3,6})\s*(?:dollars|bucks)\b/gi;
  for (const m of text.matchAll(re)) {
    const raw = (m[1] ?? m[2] ?? '').replace(/,/g, '');
    const n = Number.parseInt(raw, 10);
    if (Number.isFinite(n) && n >= min) out.push(n);
  }
  const words = parseSpokenNumbers(text);
  for (const n of words) if (n >= min && !out.includes(n)) out.push(n);
  return out;
}

const WORD_VALUES: Record<string, number> = {
  zero: 0,
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
  ten: 10,
  eleven: 11,
  twelve: 12,
  thirteen: 13,
  fourteen: 14,
  fifteen: 15,
  sixteen: 16,
  seventeen: 17,
  eighteen: 18,
  nineteen: 19,
  twenty: 20,
  thirty: 30,
  forty: 40,
  fifty: 50,
  sixty: 60,
  seventy: 70,
  eighty: 80,
  ninety: 90,
};

/** Handles "eighteen ninety", "two thousand four hundred", "forty nine a month". */
function parseSpokenNumbers(text: string): number[] {
  const tokens = text
    .toLowerCase()
    .replace(/-/g, ' ')
    .split(/[^a-z]+/)
    .filter(Boolean);
  const results: number[] = [];
  let i = 0;
  while (i < tokens.length) {
    if (!(tokens[i]! in WORD_VALUES)) {
      i++;
      continue;
    }
    // Gather a run of number words.
    const run: string[] = [];
    while (
      i < tokens.length &&
      (tokens[i]! in WORD_VALUES || ['hundred', 'thousand', 'and'].includes(tokens[i]!))
    ) {
      run.push(tokens[i]!);
      i++;
    }
    const n = runToNumber(run);
    if (n !== null) results.push(n);
  }
  return results;
}

function runToNumber(run: string[]): number | null {
  const words = run.filter((w) => w !== 'and');
  if (words.length === 0) return null;
  if (words.includes('thousand') || words.includes('hundred')) {
    let total = 0;
    let current = 0;
    for (const w of words) {
      if (w === 'thousand') {
        total += (current || 1) * 1000;
        current = 0;
      } else if (w === 'hundred') current = (current || 1) * 100;
      else current += WORD_VALUES[w] ?? 0;
    }
    return total + current;
  }
  // "eighteen ninety" pattern: two groups of tens.
  const groups: number[] = [];
  let acc = 0;
  for (const w of words) {
    const v = WORD_VALUES[w] ?? 0;
    if (v >= 20 && v % 10 === 0 && acc === 0) acc = v;
    else if (v < 10 && acc >= 20) {
      acc += v;
      groups.push(acc);
      acc = 0;
    } else {
      if (acc) groups.push(acc);
      acc = 0;
      if (v >= 20 && v % 10 === 0) acc = v;
      else groups.push(v);
    }
  }
  if (acc) groups.push(acc);
  if (groups.length === 2 && groups[0]! >= 10 && groups[0]! < 100 && groups[1]! < 100) {
    return groups[0]! * 100 + groups[1]!;
  }
  if (groups.length === 1) return groups[0]!;
  return null;
}

export function similarity(a: string, b: string): number {
  const A = new Set(a.toLowerCase().split(/\W+/).filter(Boolean));
  const B = new Set(b.toLowerCase().split(/\W+/).filter(Boolean));
  if (A.size === 0 && B.size === 0) return 1;
  let inter = 0;
  for (const w of A) if (B.has(w)) inter++;
  return inter / Math.max(A.size, B.size);
}
