import type {
  Company,
  ContentBundle,
  Drill,
  JobContext,
  Move,
  Persona,
  Phase,
  Scenario,
} from './schema';

/** Fast lookups over a content bundle, plus company and job overlays. */
export class ContentIndex {
  readonly personas = new Map<string, Persona>();
  readonly moves = new Map<string, Move>();
  readonly scenarios = new Map<string, Scenario>();
  readonly drills = new Map<string, Drill>();
  readonly companies = new Map<string, Company>();

  constructor(readonly bundle: ContentBundle) {
    for (const p of bundle.personas) this.personas.set(p.id, p);
    for (const m of bundle.moves) this.moves.set(m.id, m);
    for (const s of bundle.scenarios) this.scenarios.set(s.id, s);
    for (const d of bundle.drills) this.drills.set(d.id, d);
    for (const c of bundle.companies) this.companies.set(c.id, c);
  }

  get rubric() {
    return this.bundle.rubric;
  }

  persona(id: string): Persona {
    const p = this.personas.get(id);
    if (!p) throw new Error(`Unknown persona ${id}`);
    return p;
  }
  scenario(id: string): Scenario {
    const s = this.scenarios.get(id);
    if (!s) throw new Error(`Unknown scenario ${id}`);
    return s;
  }
  drill(id: string): Drill {
    const d = this.drills.get(id);
    if (!d) throw new Error(`Unknown drill ${id}`);
    return d;
  }
  move(id: string): Move | undefined {
    return this.moves.get(id);
  }
  company(id: string): Company | undefined {
    return this.companies.get(id);
  }

  objectionMoves(): Move[] {
    return [...this.moves.values()].filter((m) => m.kind === 'objection');
  }
  behaviorMoves(): Move[] {
    return [...this.moves.values()].filter((m) => m.kind === 'behavior');
  }
}

export interface SessionSpec {
  scenario: Scenario;
  persona: Persona;
  company?: Company;
  job?: JobContext;
  drill?: Drill;
  difficulty: number;
  startPhase: Phase;
  priorContext?: string;
  forcedMoves: string[];
  seed: number;
  language: 'en' | 'es';
  /** 'full' runs a whole call; 'drill' runs one moment; 'exam' is a scored certification call. */
  kind: 'full' | 'drill' | 'exam' | 'rehearsal';
}

export interface SpecRequest {
  scenarioId?: string;
  drillId?: string;
  personaId?: string;
  companyId?: string;
  difficulty?: number;
  job?: JobContext;
  seed?: number;
  kind?: SessionSpec['kind'];
}

/** Resolves ids into a playable session: drill or scenario, persona, company, difficulty. */
export function buildSessionSpec(index: ContentIndex, req: SpecRequest): SessionSpec {
  const drill = req.drillId ? index.drill(req.drillId) : undefined;
  const scenarioId = drill?.scenarioId ?? req.scenarioId;
  if (!scenarioId) throw new Error('A session needs a scenarioId or a drillId');
  const scenario = index.scenario(scenarioId);
  const persona = index.persona(req.personaId ?? drill?.personaId ?? scenario.personaId);
  const company = req.companyId ? index.company(req.companyId) : undefined;
  const difficulty = clampDifficulty(req.difficulty ?? scenario.difficulty);
  return {
    scenario: applyCompanyPrices(scenario, company),
    persona,
    company,
    job: req.job,
    drill,
    difficulty,
    startPhase: drill?.startPhase ?? scenario.startPhase,
    priorContext: drill?.priorContext ?? scenario.priorContext,
    forcedMoves: [...new Set([...(drill?.forcedMoves ?? []), ...scenario.moves.forced])],
    seed: req.seed ?? Math.floor(Math.random() * 2 ** 31),
    language: persona.language,
    kind: req.kind ?? (drill ? 'drill' : req.job ? 'rehearsal' : 'full'),
  };
}

const clampDifficulty = (d: number) => Math.max(1, Math.min(5, Math.round(d)));

/**
 * Keeps scenario prices inside the company's published range for the same job type,
 * so a Gardner session quotes Gardner-range numbers.
 */
function applyCompanyPrices(scenario: Scenario, company?: Company): Scenario {
  if (!company) return scenario;
  const range = company.priceRanges.find(
    (r) => r.id === scenario.jobType || r.item.toLowerCase().includes(scenario.jobType.split('-')[0] ?? ''),
  );
  if (!range) return scenario;
  const options = scenario.options.map((o) => {
    if (o.price >= range.low && o.price <= range.high) return o;
    if (o.recommended) {
      const price = Math.min(range.high, Math.max(range.low, o.price));
      return { ...o, price, monthly: o.monthly ? Math.round(price / 40) : o.monthly };
    }
    return o;
  });
  return { ...scenario, options };
}

/** Scenario built on the fly from a ServiceTitan job for "rehearse the next job". */
export function scenarioForJob(index: ContentIndex, job: JobContext): Scenario {
  const candidates = [...index.scenarios.values()].filter((s) => s.jobType === job.jobType);
  const base =
    candidates.sort((a, b) => a.difficulty - b.difficulty)[0] ??
    [...index.scenarios.values()].find((s) => job.jobType.includes(s.jobType.split('-')[0] ?? '')) ??
    [...index.scenarios.values()][0];
  if (!base) throw new Error('No scenarios in the content bundle');
  const equipment = job.equipment.length
    ? job.equipment.map((e) => ({ item: e.item, ageYears: e.ageYears }))
    : base.equipment;
  return {
    ...base,
    id: `${base.id}-job`,
    title: job.summary || base.title,
    briefing: [job.summary, job.isMember ? 'Member.' : 'Not a member.', ...job.notes].filter(Boolean).join(' '),
    equipment,
  };
}
