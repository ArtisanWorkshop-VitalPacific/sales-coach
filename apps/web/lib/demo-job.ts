import type { JobContext } from '@sales-coach/engine';

/** A realistic, fictional next job for "rehearse your next job" before ServiceTitan is connected. */
export const DEMO_JOB: JobContext = {
  source: 'demo',
  customerFirstName: 'Margaret',
  jobType: 'water-heater-replacement',
  summary: 'No hot water since this morning. 50-gallon gas water heater, original to the house.',
  equipment: [{ item: '50-gallon gas water heater', ageYears: 14 }],
  isMember: false,
  priorDeclinedEstimates: ['Whole-home water filtration, two years ago'],
  notes: ['Booked online. Asked for the earliest arrival window.'],
};
