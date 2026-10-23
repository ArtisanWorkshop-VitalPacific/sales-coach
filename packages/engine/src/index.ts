/**
 * Sales Coach customer engine.
 *
 * Content (personas, moves, scenarios) -> SessionSpec -> hidden CustomerState.
 * Each tech turn: Perceiver tags behaviors -> state updates deterministically ->
 * Director picks what the customer does -> LineWriter says it in the persona's voice.
 * After the call: rubric score, then the Claude Coach.
 *
 * Browser-safe: nothing here imports Node APIs or the Anthropic SDK. Claude adapters live
 * in "@sales-coach/engine/claude" so the demo bundle stays small.
 */

export {
  cleanLine,
  type LineWriter,
  type Perceiver,
  type PerceptionInput,
  stripTags,
  type WriteInput,
} from './adapters';
export { passedFor, phaseAtTurn, scoreRecord, tryAgainFor } from './coach/score';
export { Debrief, Evidence, SkillScore } from './coach/types';
export {
  buildSessionSpec,
  ContentIndex,
  type SessionSpec,
  type SpecRequest,
  scenarioForJob,
} from './content';
export {
  afterHoldDirective,
  type DirectorContext,
  decideNext,
  interruptDirective,
  openingDirective,
  type TurnDirective,
} from './director';
export { HeuristicPerceiver, perceiveText } from './heuristic/perceiver';
export { ScriptedWriter } from './heuristic/writer';
export type {
  CustomerTurn,
  LatencySample,
  MoveEvent,
  SessionRecord,
  StatePoint,
  TranscriptTurn,
} from './record';
export * from './schema';
export {
  CustomerSession,
  type SessionOptions,
  type SessionSnapshot,
  type TechTurnInput,
} from './session';
export {
  type CustomerState,
  type DecisionResult,
  emptyPerception,
  evaluateDecision,
  initState,
  type Mood,
  moodFor,
  type ObjectionInstance,
  type Perception,
  toneFor,
} from './state';
export {
  clamp,
  createRng,
  extractDollarAmounts,
  newId,
  planPrice,
  sayDollars,
  similarity,
  wordCount,
} from './util';
