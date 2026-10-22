import {
  type ContentIndex,
  type CustomerTurn,
  CustomerSession,
  HeuristicPerceiver,
  type LineWriter,
  type Perceiver,
  ScriptedWriter,
  type SessionRecord,
  scoreRecord,
  wordCount,
} from '@sales-coach/engine';
import { type Level, Tech, type Variant } from './tech';

/** One bench call: who, at what level, and what came out of it. */
export interface RunSpec {
  scenarioId?: string;
  drillId?: string;
  difficulty: number;
  level: Level;
  variant: Variant;
  seed: number;
  /** Which unjustified item the upsell variant recommends. */
  upsellIndex?: number;
}

export interface RunResult {
  spec: RunSpec;
  record: SessionRecord;
  score: number;
  passed: boolean;
  decision: 'yes' | 'later' | 'no' | null;
  finalTrust: number;
  techTurns: number;
  ended: boolean;
  forcedMoves: string[];
  upsoldItem: string | null;
  upsellTurn: number | null;
  error?: string;
}

export interface Adapters {
  perceiver: () => Perceiver;
  writer: (seed: number) => LineWriter;
}

export const scriptedAdapters: Adapters = {
  perceiver: () => new HeuristicPerceiver(),
  writer: (seed) => new ScriptedWriter(seed),
};

/** Tech turns allowed before the bench calls the call stuck. */
export const TURN_CAP = 40;
const WPS_TECH = 2.6;
const WPS_CUSTOMER = 2.4;
const T0 = Date.UTC(2026, 0, 5, 16, 0, 0);

const speakMs = (text: string, wps: number) => Math.round((wordCount(text) / wps) * 1000);

/**
 * Plays one call. The clock is simulated so time-based behavior (ambient move budget,
 * holds, interrupts) is deterministic and does not depend on how fast the bench runs.
 */
export async function runCall(index: ContentIndex, spec: RunSpec, adapters: Adapters): Promise<RunResult> {
  let clock = T0;
  const session = new CustomerSession(
    { scenarioId: spec.scenarioId, drillId: spec.drillId, difficulty: spec.difficulty, seed: spec.seed },
    { index, perceiver: adapters.perceiver(), writer: adapters.writer(spec.seed), now: () => clock },
  );
  const tech = new Tech(spec.level, spec.variant, spec.seed, { spec: session.spec, index }, spec.upsellIndex ?? 0);
  let techTurns = 0;
  let error: string | undefined;

  const customerSpoke = (turn: CustomerTurn | null) => {
    if (!turn) return;
    clock += turn.delayMs + speakMs(turn.text, WPS_CUSTOMER);
    tech.hear(turn);
  };

  try {
    let last = await session.start();
    customerSpoke(last);
    let guard = 0;
    while (!session.isEnded && techTurns < TURN_CAP && guard++ < TURN_CAP * 3) {
      // A hold: the customer is thinking or stepped away.
      if (last?.holdSilenceMs && last.holdKind) {
        const choice = tech.duringHold(last);
        if (choice.kind === 'wait') {
          clock += last.holdSilenceMs;
          last = await session.holdElapsed();
          customerSpoke(last);
          continue;
        }
        clock += choice.afterMs;
        const startedAtMs = session.elapsedMs;
        clock += speakMs(choice.text, WPS_TECH);
        techTurns += 1;
        last = await session.techTurn({
          text: choice.text,
          startedAtMs,
          endedAtMs: session.elapsedMs,
          holdElapsedMs: choice.afterMs,
        });
        customerSpoke(last);
        continue;
      }

      const text = tech.done ? 'Okay, thank you. Have a good day.' : tech.next(last);
      const duration = speakMs(text, WPS_TECH);

      // An armed interrupt: the customer cuts in once the tech has talked long enough.
      if (last?.armInterrupt && duration > last.armInterrupt.afterMs) {
        clock += last.armInterrupt.afterMs;
        const cut = session.interrupt();
        if (cut) {
          tech.cutOff();
          last = cut;
          customerSpoke(last);
          continue;
        }
      }

      clock += 350; // tech reaction gap
      const startedAtMs = session.elapsedMs;
      clock += duration;
      techTurns += 1;
      last = await session.techTurn({ text, startedAtMs, endedAtMs: session.elapsedMs });
      customerSpoke(last);
    }
  } catch (e) {
    error = (e as Error).stack ?? String(e);
  }

  const ended = session.isEnded;
  const record = session.end();
  const debrief = scoreRecord(record, index);
  return {
    spec,
    record,
    score: debrief.overall,
    passed: debrief.passed,
    decision: record.decision,
    finalTrust: Math.round(record.finalState.trust),
    techTurns,
    ended,
    forcedMoves: session.spec.forcedMoves,
    upsoldItem: tech.upsoldItem,
    upsellTurn: tech.upsellTurn,
    error,
  };
}
