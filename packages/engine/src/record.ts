import type { SessionSpec } from './content';
import type { TurnDirective } from './director';
import type { Act, AudioTag, BehaviorId, Phase, SoundCue, Tone } from './schema';
import type { CustomerState, Mood, Perception } from './state';

export interface TranscriptTurn {
  id: string;
  speaker: 'tech' | 'customer' | 'secondary';
  text: string;
  /** Milliseconds since the session started. */
  atMs: number;
  endMs?: number;
  act?: Act;
  tone?: Tone;
  moveId?: string;
  behaviors?: BehaviorId[];
  /** This tech turn was cut off by the customer, or cut off the customer. */
  interrupted?: boolean;
  /** For customer silences: how long the silence was held. */
  silenceMs?: number;
}

export interface MoveEvent {
  moveId: string;
  kind: 'objection' | 'behavior';
  turnId: string;
  firedAtMs: number;
  result: 'pending' | 'pass' | 'fail' | 'unclear';
  techTurnsSeen: number;
  behaviorsAfter: BehaviorId[];
  addressed: boolean;
  silenceMs?: number;
  reason?: string;
}

export interface StatePoint {
  turn: number;
  atMs: number;
  phase: Phase;
  trust: number;
  understanding: number;
  engagement: number;
  mood: Mood;
  objections: { moveId: string; strength: number; status: string }[];
}

export interface LatencySample {
  turnId: string;
  perceiveMs: number;
  writeMs: number;
  totalMs: number;
}

/** Everything about a finished (or in-progress) session. Stored, scored, and replayed. */
export interface SessionRecord {
  id: string;
  schema: 1;
  scenarioId: string;
  personaId: string;
  companyId?: string;
  drillId?: string;
  kind: SessionSpec['kind'];
  difficulty: number;
  seed: number;
  language: 'en' | 'es';
  contentVersion: string;
  adapters: { perceiver: string; writer: string };
  startedAt: string;
  endedAt?: string;
  durationMs: number;
  transcript: TranscriptTurn[];
  moves: MoveEvent[];
  timeline: StatePoint[];
  perceptions: { turnId: string; perception: Perception }[];
  directives: { turnId: string; directive: TurnDirective }[];
  decision: CustomerState['decision'];
  finalState: CustomerState;
  latency: LatencySample[];
}

/** What a client needs to play a customer turn. */
export interface CustomerTurn {
  id: string;
  speaker: 'primary' | 'secondary';
  speakerName: string;
  act: Act;
  text: string;
  tone: Tone;
  audioTags: AudioTag[];
  delayMs: number;
  holdSilenceMs?: number;
  holdKind?: 'think' | 'away';
  armInterrupt?: { afterMs: number; moveId: string; text: string };
  soundCue?: SoundCue;
  moveId?: string;
  decision?: 'yes' | 'later' | 'no';
  ended: boolean;
  /** An adapter (Claude) failed on this turn and the built-in backup answered instead. */
  degraded?: { stage: 'listen' | 'speak'; reason: string };
}
