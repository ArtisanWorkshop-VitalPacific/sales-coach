import { type ContentIndex, JobContext, type SpecRequest } from '@sales-coach/engine';

/**
 * What the web app asks for when it dispatches the agent. It arrives as JSON in the job
 * metadata (explicit dispatch), the room metadata, or the tech's participant metadata.
 *
 *   { "scenarioId": "wh-tank-no-hot-water", "difficulty": 3, "companyId": "gardner-plumbing" }
 *   { "drillId": "hold-the-silence" }
 *   { "job": { ...JobContext }, "difficulty": 2 }     rehearse the next ServiceTitan job
 */
export interface SessionRequest extends SpecRequest {
  /** The app's own session id, echoed back with the record so it can be saved. */
  appSessionId?: string;
}

function parse(raw: string | undefined | null): Record<string, unknown> | null {
  if (!raw?.trim()) return null;
  try {
    const v = JSON.parse(raw);
    return v && typeof v === 'object' && !Array.isArray(v) ? (v as Record<string, unknown>) : null;
  } catch {
    return null;
  }
}

const str = (v: unknown) => (typeof v === 'string' && v.trim() ? v.trim() : undefined);
const num = (v: unknown) =>
  typeof v === 'number' && Number.isFinite(v)
    ? v
    : typeof v === 'string' && v.trim() && Number.isFinite(Number(v))
      ? Number(v)
      : undefined;

/** First metadata source that names a scenario, drill, or job wins. Unknown ids fall back safely. */
export function readRequest(
  sources: (string | undefined | null)[],
  index: ContentIndex,
): SessionRequest {
  const found = sources.map(parse).find((m) => m && (m.scenarioId || m.drillId || m.job)) ?? {};
  const job = found.job ? JobContext.safeParse(found.job) : null;
  let scenarioId = str(found.scenarioId);
  const drillId = str(found.drillId);
  if (drillId && !index.drills.has(drillId))
    console.warn(`[agent] unknown drill ${drillId}, ignoring`);
  if (scenarioId && !index.scenarios.has(scenarioId)) {
    console.warn(`[agent] unknown scenario ${scenarioId}, using a default`);
    scenarioId = undefined;
  }
  // A ServiceTitan job with no scenario: the easiest scenario for the same job type.
  if (!scenarioId && job?.success) {
    scenarioId = [...index.scenarios.values()]
      .filter((s) => s.jobType === job.data.jobType)
      .sort((a, b) => a.difficulty - b.difficulty)[0]?.id;
  }
  const validDrill = drillId && index.drills.has(drillId) ? drillId : undefined;
  if (!scenarioId && !validDrill) {
    scenarioId =
      process.env.DEFAULT_SCENARIO_ID && index.scenarios.has(process.env.DEFAULT_SCENARIO_ID)
        ? process.env.DEFAULT_SCENARIO_ID
        : [...index.scenarios.keys()][0];
  }
  const companyId = str(found.companyId);
  return {
    scenarioId,
    drillId: validDrill,
    personaId: index.personas.has(str(found.personaId) ?? '') ? str(found.personaId) : undefined,
    companyId: companyId && index.companies.has(companyId) ? companyId : undefined,
    difficulty: num(found.difficulty),
    seed: num(found.seed),
    job: job?.success ? job.data : undefined,
    appSessionId: str(found.appSessionId),
  };
}
