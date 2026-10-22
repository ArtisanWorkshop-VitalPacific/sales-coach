import type { SkillId } from '@sales-coach/engine';

/**
 * A fictional shop for the manager console until accounts and the shared database are on.
 * Every name and number here is made up. Summit Plumbing & Air is the demo company in the library.
 * Days are relative to today so the sample never goes stale.
 */
export interface SampleTech {
  name: string;
  role: string;
  years: number;
  callsThisWeek: number;
  /** Average score this week, 0 to 100. */
  avg: number;
  /** Average score last week, for the trend. */
  lastWeekAvg: number;
  /** Per-skill averages for the 10 rubric skills. */
  skills: Record<SkillId, number>;
  lastPracticedDaysAgo: number;
  /** Days in a row with at least one practice call. */
  streak: number;
  /** Drill ids assigned by the manager. Used until the manager changes them on this device. */
  drills: string[];
}

export const SAMPLE_SHOP = 'Summit Plumbing & Air';

export const SAMPLE_TEAM: SampleTech[] = [
  {
    name: 'Marcus Reyes',
    role: 'Lead plumber',
    years: 11,
    callsThisWeek: 9,
    avg: 84,
    lastWeekAvg: 81,
    skills: {
      frame: 88,
      discovery: 85,
      findings: 90,
      options: 84,
      price: 82,
      objections: 80,
      listening: 86,
      close: 83,
      'membership-financing': 68,
      integrity: 94,
    },
    lastPracticedDaysAgo: 0,
    streak: 12,
    drills: ['membership-ask'],
  },
  {
    name: 'Dani Okafor',
    role: 'Service tech',
    years: 4,
    callsThisWeek: 7,
    avg: 72,
    lastWeekAvg: 63,
    skills: {
      frame: 78,
      discovery: 74,
      findings: 70,
      options: 72,
      price: 66,
      objections: 64,
      listening: 80,
      close: 68,
      'membership-financing': 70,
      integrity: 78,
    },
    lastPracticedDaysAgo: 0,
    streak: 5,
    drills: ['ask-for-the-decision'],
  },
  {
    name: 'Sofia Martinez',
    role: 'Water heater specialist',
    years: 7,
    callsThisWeek: 6,
    avg: 79,
    lastWeekAvg: 76,
    skills: {
      frame: 80,
      discovery: 88,
      findings: 82,
      options: 78,
      price: 74,
      objections: 72,
      listening: 90,
      close: 70,
      'membership-financing': 76,
      integrity: 80,
    },
    lastPracticedDaysAgo: 1,
    streak: 3,
    drills: ['monthly-number'],
  },
  {
    name: 'Chris Novak',
    role: 'Plumbing and HVAC',
    years: 15,
    callsThisWeek: 2,
    avg: 74,
    lastWeekAvg: 76,
    skills: {
      frame: 82,
      discovery: 62,
      findings: 80,
      options: 64,
      price: 78,
      objections: 76,
      listening: 66,
      close: 80,
      'membership-financing': 70,
      integrity: 82,
    },
    lastPracticedDaysAgo: 3,
    streak: 0,
    drills: ['five-discovery-questions', 'catch-the-detail'],
  },
  {
    name: 'Jordan Pike',
    role: 'Drain tech',
    years: 1,
    callsThisWeek: 5,
    avg: 58,
    lastWeekAvg: 53,
    skills: {
      frame: 66,
      discovery: 60,
      findings: 58,
      options: 56,
      price: 50,
      objections: 44,
      listening: 62,
      close: 48,
      'membership-financing': 54,
      integrity: 82,
    },
    lastPracticedDaysAgo: 2,
    streak: 0,
    drills: ['three-bids', 'the-cheap-fix'],
  },
  {
    name: 'Tyler Grant',
    role: 'Service tech',
    years: 2,
    callsThisWeek: 1,
    avg: 61,
    lastWeekAvg: 60,
    skills: {
      frame: 70,
      discovery: 62,
      findings: 66,
      options: 60,
      price: 48,
      objections: 55,
      listening: 64,
      close: 52,
      'membership-financing': 58,
      integrity: 75,
    },
    lastPracticedDaysAgo: 6,
    streak: 0,
    drills: ['say-the-price', 'hold-the-silence'],
  },
];
