import { JobContext } from '@sales-coach/engine';
import type { StCustomer, StEstimate, StInstalledEquipment, StJob, StMembership } from './client';

/**
 * Mapping from ServiceTitan records to the engine's JobContext.
 *
 * The rule is first name only. Last names, phone numbers, emails, street addresses, ZIP
 * codes, and gate or lockbox codes are removed here, at the mapping layer, so nothing
 * downstream (prompts, transcripts, the database) ever sees them.
 */

/** ServiceTitan job type name -> our jobType id. First match wins. */
export const JOB_TYPE_RULES: [RegExp, string][] = [
  [/tankless.*(descal|flush|service|maint|clean)|(descal|flush|service|maint).*tankless/i, 'tankless-service'],
  [/(water ?heater|\bwh\b|hot water|tankless).*(replace|install|new|swap|change ?out)|(replace|install|new).*(water ?heater|\bwh\b|tankless)/i, 'water-heater-replacement'],
  [/(water ?heater|\bwh\b|hot water).*(repair|no hot|pilot|thermocouple|diagnos|leak)|(repair|diagnos).*(water ?heater|\bwh\b)/i, 'water-heater-repair'],
  [/(water ?heater|\bwh\b).*(flush|maint|service|anode|tune)|(flush|anode).*(water ?heater|\bwh\b)/i, 'water-heater-service'],
  [/water ?heater|hot water|tankless|\bwh\b/i, 'water-heater-replacement'],
  [/gas.*(leak|smell|line|odor)|(leak|smell|odor).*gas/i, 'gas-leak-repair'],
  [/sewer|main ?line|camera|video inspection/i, 'sewer-inspection'],
  [/drain|clog|snake|rooter|jett?ing|backup|back-up|stoppage/i, 'drain-cleaning'],
  [/slab|leak detect/i, 'leak-detection'],
  [/repipe|re-pipe|galvanized/i, 'repipe'],
  [/\bprv\b|pressure (reduc|regulat)|water pressure/i, 'pressure-regulator'],
  [/toilet/i, 'toilet-repair'],
  [/faucet|fixture/i, 'faucet-install'],
  [/disposal/i, 'disposal-replacement'],
  [/softener|filtration|filter|water treatment|ro system|reverse osmosis/i, 'water-treatment'],
  [/shut-?off|main valve/i, 'shutoff-valve'],
  [/maint|tune|inspection|membership visit|check-?up/i, 'maintenance-visit'],
];

export function mapJobType(stName: string | undefined | null): string {
  const name = (stName ?? '').trim();
  for (const [re, id] of JOB_TYPE_RULES) if (re.test(name)) return id;
  // Unknown types keep a readable id so scenario matching can still try a partial match.
  return (
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'service-call'
  );
}

const HONORIFIC = /^(mr|mrs|ms|miss|mx|dr)\.?$/i;

/** Splits a ServiceTitan customer name into the first name and every other name token. */
export function splitName(customer: Pick<StCustomer, 'name' | 'type'>): { first?: string; others: string[] } {
  const raw = (customer.name ?? '').trim();
  if (!raw) return { others: [] };
  const tokens = (s: string) =>
    s
      .split(/[\s,&/]+/)
      .map((t) => t.replace(/[^\p{L}'-]/gu, ''))
      .filter((t) => t.length > 1 && !HONORIFIC.test(t));
  // Businesses do not have a first name; every token is scrubbed.
  if (customer.type && /commercial|business/i.test(customer.type)) return { others: tokens(raw) };
  // "Ellis, Margaret" is last-name-first.
  const [last, rest] = raw.includes(',') ? [raw.split(',')[0]!, raw.split(',').slice(1).join(' ')] : ['', raw];
  const ordered = [...tokens(rest), ...tokens(last)];
  const first = ordered[0];
  return { first: first ? capitalize(first) : undefined, others: ordered.slice(1) };
}

/** First name only, or undefined for businesses and empty names. */
export const firstNameOnly = (customer: Pick<StCustomer, 'name' | 'type'>) => splitName(customer).first;

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const PATTERNS: RegExp[] = [
  /[\w.+-]+@[\w-]+(\.[\w-]+)+/g, // emails
  /(\+?1[\s.-]?)?\(?\b\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}\b/g, // phone numbers
  /\b\d{1,6}\s+(?:[A-Za-z0-9][\w'.-]*\s+){0,4}(?:st|street|ave|avenue|rd|road|dr|drive|ln|lane|blvd|boulevard|ct|court|way|pl|place|cir|circle|pkwy|parkway|ter|terrace|hwy|highway|trl|trail|loop)\b\.?(?:,?\s*(?:apt|unit|suite|ste|#)\s*[\w-]+)?/gi, // street addresses
  /\b(?:apt|unit|suite|ste)\.?\s*#?\s*\w+/gi, // unit numbers
  /#\s*\d+\b/g, // "#12" style unit numbers
  /\b[A-Z][a-z]+(?:\s[A-Z][a-z]+)?,?\s(?:A[LKZR]|C[AOT]|DE|FL|GA|HI|I[ADLN]|K[SY]|LA|M[ADEINOST]|N[CDEHJMVY]|O[HKR]|PA|RI|S[CD]|T[NX]|UT|V[AT]|W[AIVY])\b/g, // "City, ST"
  /\b\d{5}(?:-\d{4})?\b/g, // ZIP codes
  /\b(?:gate|lock ?box|door|alarm|garage|key ?pad)\s*(?:code|combo|pin)?\s*(?:is|:|#)?\s*\d{3,8}\b/gi, // access codes
];

/**
 * Removes personal details from free text: HTML, emails, phones, addresses, ZIPs,
 * access codes, and every customer name token except the first name.
 */
export function scrubText(text: string | null | undefined, removeNames: string[] = [], max = 400): string {
  if (!text) return '';
  let t = text
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&quot;/g, '"');
  for (const re of PATTERNS) t = t.replace(re, ' (removed) ');
  // Honorific plus a surname ("Mrs. Ellis") becomes "the customer".
  t = t.replace(/\b(?:Mr|Mrs|Ms|Miss|Mx|Dr)\.?\s+[A-Z][\w'-]+/g, 'the customer');
  for (const n of removeNames) {
    if (n.length < 2) continue;
    t = t.replace(new RegExp(`\\b${escapeRe(n)}('s)?\\b`, 'gi'), ' ');
  }
  t = t
    .replace(/\s+/g, ' ')
    // "at (removed) or (removed), (removed)" -> "at (removed)"
    .replace(/\(removed\)(?:[\s,.;:]*(?:or|and|at|&|in)?[\s,.;:]*\(removed\))+/g, '(removed)')
    .replace(/\s+([,.;:!?])/g, '$1')
    .replace(/([,;:])(?:\s*[,;:])+/g, '$1')
    .replace(/\s{2,}/g, ' ')
    .trim();
  return t.length > max ? `${t.slice(0, max - 3).trimEnd()}...` : t;
}

/** Whole years since an ISO date, or undefined when unknown or in the future. */
export function ageInYears(installedOn: string | null | undefined, now = Date.now()): number | undefined {
  if (!installedOn) return undefined;
  const t = Date.parse(installedOn);
  if (!Number.isFinite(t) || t > now) return undefined;
  return Math.floor((now - t) / (365.25 * 24 * 3600 * 1000));
}

const money = (n: number) => `$${Math.round(n).toLocaleString('en-US')}`;
const monthYear = (iso: string) => {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? '' : d.toLocaleString('en-US', { month: 'short', year: 'numeric', timeZone: 'UTC' });
};

/** "Water heater flush ($189), Mar 2025". Names and totals only, never line-item notes. */
export function estimateSummary(e: StEstimate, removeNames: string[] = []): string {
  const name = scrubText(e.name, removeNames, 80) || 'Estimate';
  const total = typeof e.subtotal === 'number' && e.subtotal > 0 ? ` (${money(e.subtotal)})` : '';
  const when = e.createdOn ? monthYear(e.createdOn) : '';
  return `${name}${total}${when ? `, ${when}` : ''}`;
}

export interface JobParts {
  job: StJob;
  jobTypeName?: string | null;
  customer: StCustomer;
  equipment: StInstalledEquipment[];
  memberships: StMembership[];
  declinedEstimates: StEstimate[];
  scheduledFor?: string;
  now?: number;
}

/** Builds the engine's JobContext. Everything personal is dropped or scrubbed here. */
export function toJobContext(p: JobParts): JobContext {
  const now = p.now ?? Date.now();
  const { first, others } = splitName(p.customer);
  const jobType = mapJobType(p.jobTypeName);
  const summary = scrubText(p.job.summary, others) || (p.jobTypeName ? scrubText(p.jobTypeName, others) : 'Service call');
  const equipment = p.equipment
    .filter((e) => e.active !== false)
    .slice(0, 8)
    .map((e) => {
      const item = scrubText(e.name || [e.manufacturer, e.model].filter(Boolean).join(' '), others, 80) || 'Equipment';
      const ageYears = ageInYears(e.installedOn, now);
      return ageYears === undefined ? { item } : { item, ageYears };
    });
  const isMember = p.memberships.some((m) => m.active !== false && (!m.status || /active/i.test(m.status)));
  const priorDeclinedEstimates = p.declinedEstimates
    .filter((e) => String(e.jobId ?? '') !== p.job.id)
    .slice(0, 5)
    .map((e) => estimateSummary(e, others));
  return JobContext.parse({
    source: 'servicetitan',
    jobId: p.job.id,
    customerFirstName: first,
    jobType,
    scheduledFor: p.scheduledFor,
    summary,
    equipment,
    isMember,
    priorDeclinedEstimates,
    notes: [],
  });
}
