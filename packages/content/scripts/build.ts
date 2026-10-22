/**
 * Validates the YAML content library and builds the JSON bundle the apps load.
 *
 *   tsx scripts/build.ts validate            schema, cross-reference, and style checks
 *   tsx scripts/build.ts validate --strict   also fails when a registry id has no file
 *   tsx scripts/build.ts build               validate, then write generated/bundle.json
 *   ... --only personas                      limit file checks to one folder
 */
import { createHash } from 'node:crypto';
import { mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { basename, dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  type Company,
  Company as CompanySchema,
  ContentBundle,
  type Drill,
  Drill as DrillSchema,
  type Move,
  Move as MoveSchema,
  type Persona,
  Persona as PersonaSchema,
  type Rubric,
  Rubric as RubricSchema,
  type Scenario,
  Scenario as ScenarioSchema,
} from '@sales-coach/engine/schema';
import { parse } from 'yaml';
import type { z } from 'zod';

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..');
const library = join(root, 'library');

const args = process.argv.slice(2);
const mode = args[0] === 'build' ? 'build' : 'validate';
const strict = args.includes('--strict') || mode === 'build-strict';
const onlyIdx = args.indexOf('--only');
const only = onlyIdx >= 0 ? args[onlyIdx + 1] : undefined;

interface Problem {
  file: string;
  level: 'error' | 'warning';
  message: string;
}
const problems: Problem[] = [];
const err = (file: string, message: string) => problems.push({ file, level: 'error', message });
const warn = (file: string, message: string) => problems.push({ file, level: 'warning', message });

function yamlFiles(dir: string): string[] {
  const abs = join(library, dir);
  let entries: string[] = [];
  try {
    entries = readdirSync(abs);
  } catch {
    return [];
  }
  const out: string[] = [];
  for (const name of entries) {
    const p = join(abs, name);
    if (statSync(p).isDirectory()) out.push(...yamlFiles(join(dir, name)));
    else if (name.endsWith('.yaml') || name.endsWith('.yml')) out.push(p);
  }
  return out.sort();
}

function load<T>(dir: string, schema: z.ZodType<T>): { data: T; file: string }[] {
  const items: { data: T; file: string }[] = [];
  for (const file of yamlFiles(dir)) {
    const rel = relative(root, file);
    let raw: unknown;
    try {
      raw = parse(readFileSync(file, 'utf8'));
    } catch (e) {
      err(rel, `YAML does not parse: ${(e as Error).message}`);
      continue;
    }
    checkStyle(rel, raw);
    const result = schema.safeParse(raw);
    if (!result.success) {
      for (const issue of result.error.issues) {
        err(rel, `${issue.path.join('.') || '(root)'}: ${issue.message}`);
      }
      continue;
    }
    const data = result.data as T & { id?: string };
    const stem = basename(file).replace(/\.ya?ml$/, '');
    if (data.id && data.id !== stem && dir !== 'rubric') {
      err(rel, `id "${data.id}" does not match the file name "${stem}"`);
    }
    items.push({ data, file: rel });
  }
  return items;
}

/** House style: no em dashes anywhere in copy. */
function checkStyle(file: string, value: unknown, path: string[] = []): void {
  if (typeof value === 'string') {
    if (value.includes('—')) err(file, `${path.join('.')}: contains an em dash. Rewrite the sentence.`);
    if (/\bAI\b|\bassistant\b|\blanguage model\b/i.test(value) && path.some((p) => p === 'lines' || p === 'sampleLines' || p === 'openingLines')) {
      err(file, `${path.join('.')}: customer lines must never mention AI or assistants.`);
    }
    return;
  }
  if (Array.isArray(value)) value.forEach((v, i) => checkStyle(file, v, [...path, String(i)]));
  else if (value && typeof value === 'object') {
    for (const [k, v] of Object.entries(value)) checkStyle(file, v, [...path, k]);
  }
}

interface Registry {
  personas: string[];
  objections: Record<string, string[]>;
  behaviors: Record<string, string[]>;
  scenarios: string[];
  drills: string[];
  companies: string[];
}
const registry = parse(readFileSync(join(library, 'registry.yaml'), 'utf8')) as Registry;
const reg = {
  personas: new Set(registry.personas),
  objections: new Set(Object.values(registry.objections).flat()),
  behaviors: new Set(Object.values(registry.behaviors).flat()),
  scenarios: new Set(registry.scenarios),
  drills: new Set(registry.drills),
  companies: new Set(registry.companies),
};
const objectionGroupOf = new Map<string, string>();
for (const [group, ids] of Object.entries(registry.objections)) ids.forEach((id) => objectionGroupOf.set(id, group));
const behaviorGroupOf = new Map<string, string>();
for (const [group, ids] of Object.entries(registry.behaviors)) ids.forEach((id) => behaviorGroupOf.set(id, group));
const allMoves = new Set([...reg.objections, ...reg.behaviors]);

const want = (dir: string) => !only || dir.startsWith(only);

const personas = want('personas') ? load<Persona>('personas', PersonaSchema) : [];
const objections = want('moves') ? load<Move>('moves/objections', MoveSchema) : [];
const behaviorMoves = want('moves') ? load<Move>('moves/behaviors', MoveSchema) : [];
const scenarios = want('scenarios') ? load<Scenario>('scenarios', ScenarioSchema) : [];
const drills = want('drills') ? load<Drill>('drills', DrillSchema) : [];
const companies = want('companies') ? load<Company>('companies', CompanySchema) : [];
const rubrics = want('rubric') ? load<Rubric>('rubric', RubricSchema) : [];

/* ------------------------------------------------------- cross-references */

const moveRef = (file: string, where: string, id: string) => {
  if (!allMoves.has(id)) err(file, `${where}: unknown move id "${id}" (not in registry.yaml)`);
};
const personaRef = (file: string, where: string, id: string) => {
  if (!reg.personas.has(id)) err(file, `${where}: unknown persona id "${id}"`);
};

for (const { data: p, file } of personas) {
  if (!reg.personas.has(p.id)) err(file, `persona "${p.id}" is not in registry.yaml`);
  for (const o of p.hidden.objections) {
    if (!reg.objections.has(o.moveId)) err(file, `hidden.objections: "${o.moveId}" is not an objection move`);
  }
  for (const key of Object.keys(p.movePreferences)) moveRef(file, 'movePreferences', key);
  if ((p.hidden.decisionMaker === 'joint' || p.hidden.decisionMaker === 'spouse') && !p.secondary) {
    warn(file, 'decision maker is joint or spouse but no secondary person is defined');
  }
  if (p.hidden.realConcern.revealAtTrust <= p.hidden.startingTrust) {
    warn(file, 'realConcern.revealAtTrust is at or below startingTrust, so it reveals immediately');
  }
  if (p.language === 'en' && /[áéíóúñ¿¡]/i.test(p.speech.sampleLines.join(' '))) {
    warn(file, 'English persona has Spanish characters in sample lines');
  }
}

for (const { data: m, file } of [...objections, ...behaviorMoves]) {
  if (!allMoves.has(m.id)) err(file, `move "${m.id}" is not in registry.yaml`);
  if (m.kind === 'objection') {
    if (!reg.objections.has(m.id)) err(file, 'kind is objection but the id is registered as a behavior move');
    if (objectionGroupOf.get(m.id) !== m.group) err(file, `group "${m.group}" does not match registry group "${objectionGroupOf.get(m.id)}"`);
    if (!m.resolution) err(file, 'objection moves need a resolution block');
    if (!file.includes('/objections/')) err(file, 'objection moves live in moves/objections/');
  } else {
    if (!reg.behaviors.has(m.id)) err(file, 'kind is behavior but the id is registered as an objection');
    if (behaviorGroupOf.get(m.id) !== m.group) err(file, `group "${m.group}" does not match registry group "${behaviorGroupOf.get(m.id)}"`);
    if (!file.includes('/behaviors/')) err(file, 'behavior moves live in moves/behaviors/');
  }
  if (m.delivery.act === 'silence' && !m.delivery.holdSilenceMs) err(file, 'silence moves need delivery.holdSilenceMs');
  if (m.delivery.act === 'interrupt' && !m.delivery.interruptAfterMs) err(file, 'interrupt moves need delivery.interruptAfterMs');
  if (Array.isArray(m.personas)) m.personas.forEach((id) => personaRef(file, 'personas', id));
  if (m.trigger.when.objectionAnswered) moveRef(file, 'trigger.when.objectionAnswered', m.trigger.when.objectionAnswered);
  if (m.delivery.lines.some((l) => l.split(/\s+/).length > 45)) warn(file, 'a delivery line is over 45 words; customers speak in short lines');
}

for (const { data: s, file } of scenarios) {
  if (!reg.scenarios.has(s.id)) err(file, `scenario "${s.id}" is not in registry.yaml`);
  personaRef(file, 'personaId', s.personaId);
  s.alternatePersonas.forEach((id) => personaRef(file, 'alternatePersonas', id));
  if (s.moves.allowed !== '*') s.moves.allowed.forEach((id) => moveRef(file, 'moves.allowed', id));
  s.moves.forced.forEach((id) => moveRef(file, 'moves.forced', id));
  s.moves.excluded.forEach((id) => moveRef(file, 'moves.excluded', id));
  if (!s.options.some((o) => o.recommended)) err(file, 'mark the honest recommendation with recommended: true');
  const ids = new Set<string>();
  for (const o of s.options) {
    if (ids.has(o.id)) err(file, `duplicate option id ${o.id}`);
    ids.add(o.id);
  }
}

const orders = new Set<number>();
for (const { data: d, file } of drills) {
  if (!reg.drills.has(d.id)) err(file, `drill "${d.id}" is not in registry.yaml`);
  if (!reg.scenarios.has(d.scenarioId)) err(file, `scenarioId "${d.scenarioId}" is not in registry.yaml`);
  personaRef(file, 'personaId', d.personaId);
  d.forcedMoves.forEach((id) => moveRef(file, 'forcedMoves', id));
  if (orders.has(d.order)) err(file, `duplicate drill order ${d.order}`);
  orders.add(d.order);
  const words = d.why.split(/\s+/).length;
  if (words < 110 || words > 200) warn(file, `why is ${words} words; aim for 130 to 170 (about 60 seconds spoken)`);
}

for (const { data: c, file } of companies) {
  if (!reg.companies.has(c.id)) err(file, `company "${c.id}" is not in registry.yaml`);
  c.objectionAnswers.forEach((a) => moveRef(file, 'objectionAnswers', a.moveId));
}

if (rubrics.length > 1) err('library/rubric', 'exactly one rubric file is expected');
for (const { data: r, file } of rubrics) {
  const ids = new Set(r.skills.map((s) => s.id));
  if (ids.size !== 10) err(file, 'rubric needs ten distinct skills');
}

/* ------------------------------------------------------------ completeness */

const present = {
  personas: new Set(personas.map((x) => x.data.id)),
  moves: new Set([...objections, ...behaviorMoves].map((x) => x.data.id)),
  scenarios: new Set(scenarios.map((x) => x.data.id)),
  drills: new Set(drills.map((x) => x.data.id)),
  companies: new Set(companies.map((x) => x.data.id)),
};
const missing: string[] = [];
if (!only) {
  for (const id of reg.personas) if (!present.personas.has(id)) missing.push(`persona ${id}`);
  for (const id of allMoves) if (!present.moves.has(id)) missing.push(`move ${id}`);
  for (const id of reg.scenarios) if (!present.scenarios.has(id)) missing.push(`scenario ${id}`);
  for (const id of reg.drills) if (!present.drills.has(id)) missing.push(`drill ${id}`);
  for (const id of reg.companies) if (!present.companies.has(id)) missing.push(`company ${id}`);
  if (rubrics.length === 0) missing.push('rubric base');
  for (const m of missing) (strict ? err : warn)('library', `missing file for ${m}`);
}

/* ----------------------------------------------------------------- report */

const errors = problems.filter((p) => p.level === 'error');
const warnings = problems.filter((p) => p.level === 'warning');
const byFile = new Map<string, Problem[]>();
for (const p of problems) byFile.set(p.file, [...(byFile.get(p.file) ?? []), p]);
for (const [file, list] of byFile) {
  if (file === 'library' && list.every((p) => p.level === 'warning') && list.length > 8) {
    console.log(`library: ${list.length} registry ids have no file yet`);
    continue;
  }
  console.log(file);
  for (const p of list) console.log(`  ${p.level === 'error' ? 'ERROR' : 'warn '} ${p.message}`);
}
console.log(
  `\n${personas.length} personas, ${objections.length} objections, ${behaviorMoves.length} behavior moves, ` +
    `${scenarios.length} scenarios, ${drills.length} drills, ${companies.length} companies, ${rubrics.length} rubric. ` +
    `${errors.length} errors, ${warnings.length} warnings.`,
);

if (errors.length > 0) process.exit(1);

if (mode === 'build') {
  if (rubrics.length === 0) {
    console.error('Cannot build a bundle without library/rubric/base.yaml');
    process.exit(1);
  }
  const body = {
    personas: personas.map((x) => x.data),
    moves: [...objections, ...behaviorMoves].map((x) => x.data),
    scenarios: scenarios.map((x) => x.data),
    rubric: rubrics[0]!.data,
    drills: drills.map((x) => x.data).sort((a, b) => a.order - b.order),
    companies: companies.map((x) => x.data),
  };
  const hash = createHash('sha256').update(JSON.stringify(body)).digest('hex').slice(0, 12);
  const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8')) as { version: string };
  const bundle = ContentBundle.parse({
    version: `${pkg.version}+${hash}`,
    hash,
    builtAt: new Date().toISOString(),
    ...body,
  });
  mkdirSync(join(root, 'generated'), { recursive: true });
  writeFileSync(join(root, 'generated', 'bundle.json'), `${JSON.stringify(bundle, null, 1)}\n`);
  console.log(`Wrote generated/bundle.json (${hash})`);
}
