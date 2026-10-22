import { bundle, contentIndex } from '@sales-coach/content';
import type { Drill, Move, Persona, Scenario } from '@sales-coach/engine';

export { bundle, contentIndex };

export const scenarios = (): Scenario[] => [...contentIndex().scenarios.values()];
export const drills = (): Drill[] => [...contentIndex().drills.values()].sort((a, b) => a.order - b.order);
export const personas = (): Persona[] => [...contentIndex().personas.values()];
export const objections = (): Move[] => contentIndex().objectionMoves();
export const behaviorMoves = (): Move[] => contentIndex().behaviorMoves();
export const companies = () => [...contentIndex().companies.values()];

export const DIFFICULTY_LABEL = ['', 'Warm-up', 'Easy', 'Real world', 'Tough', 'Brutal'] as const;

export const JOB_LABEL: Record<string, string> = {
  'water-heater-replacement': 'Water heater',
  'water-heater-repair': 'Water heater repair',
  'tankless-repair': 'Tankless',
  'drain-cleaning': 'Drain',
  'sewer-line': 'Sewer line',
  'slab-leak': 'Slab leak',
  'repipe': 'Repipe',
  'fixture-repair': 'Fixtures',
  'water-treatment': 'Water treatment',
  'gas-line': 'Gas line',
  'leak-repair': 'Leak',
  'toilet': 'Toilet',
  'faucet': 'Faucet',
  'garbage-disposal': 'Disposal',
  'hvac-tune-up': 'HVAC tune-up',
};

export function jobLabel(jobType: string): string {
  if (JOB_LABEL[jobType]) return JOB_LABEL[jobType]!;
  return jobType
    .split('-')
    .map((w, i) => (i === 0 ? w[0]!.toUpperCase() + w.slice(1) : w))
    .join(' ');
}

export const SKILL_ORDER = [
  'frame',
  'discovery',
  'findings',
  'options',
  'price',
  'objections',
  'listening',
  'close',
  'membership-financing',
  'integrity',
] as const;
