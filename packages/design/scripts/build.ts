/**
 * tokens.json -> generated/tokens.css (CSS variables, light + dark) and generated/tokens.ts.
 * The web app imports the CSS; native apps will read tokens.json directly.
 */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const tokens = JSON.parse(readFileSync(join(root, 'tokens.json'), 'utf8'));
const out = join(root, 'generated');
mkdirSync(out, { recursive: true });

const vars = (prefix: string, obj: Record<string, string>) =>
  Object.entries(obj).map(([k, v]) => `  --sc-${prefix}-${k}: ${v};`);

const typeVars = Object.entries(tokens.type as Record<string, Record<string, string>>).flatMap(
  ([name, t]) => [
    `  --sc-type-${name}-size: ${t.size};`,
    `  --sc-type-${name}-line: ${t.line};`,
    `  --sc-type-${name}-tracking: ${t.tracking};`,
    `  --sc-type-${name}-weight: ${t.weight};`,
  ],
);

const {
  ambient,
  'ambient-dark': ambientDark,
  ...gradients
} = tokens.gradient as Record<string, string>;

const shared = [
  ...vars('gradient', gradients),
  ...vars('blur', tokens.blur),
  ...vars('font', tokens.font),
  ...typeVars,
  ...vars('radius', tokens.radius),
  ...vars('space', tokens.space),
  ...vars('shadow', tokens.shadow),
  ...vars('motion', tokens.motion),
  ...vars('layout', tokens.layout),
];

const light = [...vars('color', tokens.color.light), `  --sc-ambient: ${ambient};`];
const dark = [...vars('color', tokens.color.dark), `  --sc-ambient: ${ambientDark};`];
const indent = (lines: string[]) => lines.map((l) => `  ${l}`).join('\n');

// Light is the design. Dark is an explicit choice in Settings; "device" follows the phone.
const css = `/* Generated from packages/design/tokens.json. Do not edit by hand. */
:root {
${[...light, ...shared].join('\n')}
  color-scheme: light;
}

:root[data-theme='dark'] {
${dark.join('\n')}
  color-scheme: dark;
}

@media (prefers-color-scheme: dark) {
  :root[data-theme='device'] {
${indent(dark)}
    color-scheme: dark;
  }
}
`;

writeFileSync(join(out, 'tokens.css'), css);
writeFileSync(
  join(out, 'tokens.ts'),
  `/* Generated from packages/design/tokens.json. Do not edit by hand. */\nexport const tokens = ${JSON.stringify(tokens, null, 2)} as const;\nexport type Tokens = typeof tokens;\n`,
);
console.log('design tokens: wrote generated/tokens.css and generated/tokens.ts');
