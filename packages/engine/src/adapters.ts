import type { SessionSpec } from './content';
import type { TurnDirective } from './director';
import type { TranscriptTurn } from './record';
import type { BehaviorId } from './schema';
import type { CustomerState, Perception } from './state';

export interface PerceptionInput {
  spec: SessionSpec;
  state: CustomerState;
  transcript: TranscriptTurn[];
  techText: string;
  /** Concerns the customer holds right now: voiced objections plus the hidden real concern. */
  concerns: {
    id: string;
    label: string;
    concern: string;
    voiced: boolean;
    resolvers: BehaviorId[];
  }[];
  revealedFacts: { id: string; text: string; useValue: string }[];
  lastCustomerTurn?: TranscriptTurn;
  lastCustomerMoveGroup?: string;
}

/** Turns what the tech said into behaviors. Claude in production; rules in demo mode. */
export interface Perceiver {
  readonly name: string;
  perceive(input: PerceptionInput, signal?: AbortSignal): Promise<Perception>;
}

export interface WriteInput {
  spec: SessionSpec;
  state: CustomerState;
  transcript: TranscriptTurn[];
  directive: TurnDirective;
}

/** Turns a directive into the customer's spoken words. */
export interface LineWriter {
  readonly name: string;
  write(input: WriteInput, signal?: AbortSignal): Promise<string>;
  /** Optional streaming variant: yields text as it is generated. */
  stream?(input: WriteInput, signal?: AbortSignal): AsyncIterable<string>;
}

/** Strip anything the TTS should not read and enforce the tag allow-list. */
export function cleanLine(text: string, allowTags: readonly string[]): string {
  let t = text.trim();
  // Drop wrapping quotes and speaker labels a model might add.
  t = t.replace(/^["“”']+|["“”']+$/g, '').replace(/^[A-Z][a-z]+:\s+/, '');
  // Remove stage directions in parentheses.
  t = t.replace(/\(([^)]{0,80})\)/g, '').replace(/\s{2,}/g, ' ');
  // Keep only allowed [tags].
  t = t.replace(/\[([^\]]{1,24})\]/g, (m, tag: string) =>
    allowTags.includes(tag.toLowerCase()) ? `[${tag.toLowerCase()}]` : '',
  );
  // No em dashes in spoken output either.
  t = t.replace(/\s*—\s*/g, ', ');
  return t.trim();
}

/** Remove [tags] for display or for voices that would read them aloud. */
export const stripTags = (text: string) => text.replace(/\[[^\]]{1,24}\]\s*/g, '').trim();
