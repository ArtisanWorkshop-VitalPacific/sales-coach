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
export * from './schema';
export { ContentIndex, buildSessionSpec, scenarioForJob, type SessionSpec, type SpecRequest } from './content';
export {
  type CustomerState,
  type Mood,
  type ObjectionInstance,
  type Perception,
  type DecisionResult,
  emptyPerception,
  evaluateDecision,
  initState,
  moodFor,
  toneFor,
} from './state';
export {
  type TurnDirective,
  type DirectorContext,
  openingDirective,
  decideNext,
  afterHoldDirective,
  interruptDirective,
} from './director';
export type {
  CustomerTurn,
  LatencySample,
  MoveEvent,
  SessionRecord,
  StatePoint,
  TranscriptTurn,
} from './record';
export { type LineWriter, type Perceiver, type PerceptionInput, type WriteInput, cleanLine, stripTags } from './adapters';
export { CustomerSession, type SessionOptions, type SessionSnapshot, type TechTurnInput } from './session';
export { HeuristicPerceiver, perceiveText } from './heuristic/perceiver';
export { ScriptedWriter } from './heuristic/writer';
export { passedFor, phaseAtTurn, scoreRecord, tryAgainFor } from './coach/score';
export { Debrief, Evidence, SkillScore } from './coach/types';
export { clamp, createRng, extractDollarAmounts, newId, sayDollars, similarity, wordCount } from './util';
