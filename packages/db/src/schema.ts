import { relations, sql } from 'drizzle-orm';
import {
  boolean,
  check,
  doublePrecision,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from 'drizzle-orm/pg-core';

/**
 * Postgres schema (Neon). Tenants are companies; every row that belongs to a tenant
 * carries company_id, and every table with a timeline is indexed on (company_id, created_at).
 *
 * Session records and debriefs are stored whole as jsonb. Their full shapes are
 * SessionRecord and Debrief in @sales-coach/engine; the types below are the minimum
 * this package relies on, so the database package stays independent of the engine.
 */

export const tier = pgEnum('tier', ['core', 'pro', 'elite', 'enterprise']);
export const personRole = pgEnum('person_role', ['tech', 'manager', 'owner']);
export const sessionKind = pgEnum('session_kind', ['full', 'drill', 'exam', 'rehearsal']);
export const decision = pgEnum('decision', ['yes', 'later', 'no']);

const createdAt = () => timestamp('created_at', { withTimezone: true }).notNull().defaultNow();

export type SessionRecordJson = { id: string; scenarioId: string; [key: string]: unknown };
export type DebriefJson = { sessionId: string; overall: number; passed: boolean; [key: string]: unknown };
export type AdaptersJson = { perceiver: string; writer: string };
export type ObjectionAnswerJson = { moveId: string; answer: string };
export type ScriptsJson = { preferred: { moment: string; line: string }[]; banned: string[] };
export type PriceRangeJson = { id: string; item: string; low: number; high: number; source?: string };

/* ----------------------------------------------------------------- companies */

export const companies = pgTable('companies', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  tier: tier('tier').notNull().default('core'),
  /** Licenses are priced by trucks. */
  trucks: integer('trucks').notNull().default(1),
  /** Company id in the content library (company specs, price ranges), when one exists. */
  contentCompanyId: text('content_company_id'),
  stripeCustomerId: text('stripe_customer_id').unique(),
  stripeSubscriptionId: text('stripe_subscription_id').unique(),
  createdAt: createdAt(),
});

/* -------------------------------------------------------------------- people */

export const people = pgTable(
  'people',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    companyId: uuid('company_id')
      .notNull()
      .references(() => companies.id, { onDelete: 'cascade' }),
    /** Null until the person signs in for the first time. */
    clerkUserId: text('clerk_user_id').unique(),
    name: text('name').notNull(),
    role: personRole('role').notNull().default('tech'),
    servicetitanTechnicianId: text('servicetitan_technician_id'),
    active: boolean('active').notNull().default(true),
    createdAt: createdAt(),
  },
  (t) => [
    index('people_company_created_idx').on(t.companyId, t.createdAt),
    uniqueIndex('people_company_st_tech_idx').on(t.companyId, t.servicetitanTechnicianId),
  ],
);

/* ------------------------------------------------------------------ sessions */

export const sessions = pgTable(
  'sessions',
  {
    /** The engine's session id (SessionRecord.id), e.g. "ses_...". */
    id: text('id').primaryKey(),
    companyId: uuid('company_id')
      .notNull()
      .references(() => companies.id, { onDelete: 'cascade' }),
    personId: uuid('person_id')
      .notNull()
      .references(() => people.id, { onDelete: 'cascade' }),
    scenarioId: text('scenario_id').notNull(),
    personaId: text('persona_id').notNull(),
    drillId: text('drill_id'),
    kind: sessionKind('kind').notNull().default('full'),
    difficulty: integer('difficulty').notNull(),
    durationMs: integer('duration_ms').notNull().default(0),
    decision: decision('decision'),
    overallScore: integer('overall_score'),
    passed: boolean('passed'),
    record: jsonb('record').$type<SessionRecordJson>().notNull(),
    debrief: jsonb('debrief').$type<DebriefJson>(),
    contentVersion: text('content_version').notNull(),
    adapters: jsonb('adapters').$type<AdaptersJson>().notNull(),
    createdAt: createdAt(),
  },
  (t) => [
    index('sessions_company_created_idx').on(t.companyId, t.createdAt),
    index('sessions_person_created_idx').on(t.personId, t.createdAt),
    check('sessions_difficulty_range', sql`${t.difficulty} between 1 and 5`),
    check('sessions_score_range', sql`${t.overallScore} is null or ${t.overallScore} between 0 and 100`),
  ],
);

/* --------------------------------------------------------------- assignments */

export const assignments = pgTable(
  'assignments',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    companyId: uuid('company_id')
      .notNull()
      .references(() => companies.id, { onDelete: 'cascade' }),
    /** The manager or owner who assigned it. */
    assignedById: uuid('assigned_by_id').references(() => people.id, { onDelete: 'set null' }),
    /** The tech who practices it. */
    assigneeId: uuid('assignee_id')
      .notNull()
      .references(() => people.id, { onDelete: 'cascade' }),
    drillId: text('drill_id'),
    scenarioId: text('scenario_id'),
    difficulty: integer('difficulty'),
    note: text('note'),
    dueAt: timestamp('due_at', { withTimezone: true }),
    completedSessionId: text('completed_session_id').references(() => sessions.id, { onDelete: 'set null' }),
    completedAt: timestamp('completed_at', { withTimezone: true }),
    createdAt: createdAt(),
  },
  (t) => [
    index('assignments_company_created_idx').on(t.companyId, t.createdAt),
    index('assignments_assignee_due_idx').on(t.assigneeId, t.dueAt),
    check('assignments_target', sql`${t.drillId} is not null or ${t.scenarioId} is not null`),
  ],
);

/* --------------------------------------------------------- content overrides */

/** A company's own objection answers, scripts, and price ranges. Each save is a new version. */
export const contentOverrides = pgTable(
  'content_overrides',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    companyId: uuid('company_id')
      .notNull()
      .references(() => companies.id, { onDelete: 'cascade' }),
    version: integer('version').notNull(),
    objectionAnswers: jsonb('objection_answers').$type<ObjectionAnswerJson[]>().notNull().default([]),
    scripts: jsonb('scripts').$type<ScriptsJson>().notNull().default({ preferred: [], banned: [] }),
    priceRanges: jsonb('price_ranges').$type<PriceRangeJson[]>().notNull().default([]),
    createdById: uuid('created_by_id').references(() => people.id, { onDelete: 'set null' }),
    createdAt: createdAt(),
  },
  (t) => [
    uniqueIndex('content_overrides_company_version_idx').on(t.companyId, t.version),
    index('content_overrides_company_created_idx').on(t.companyId, t.createdAt),
  ],
);

/* --------------------------------------------------------------------- usage */

/** Minutes per company per month, for plan limits and billing. */
export const usage = pgTable(
  'usage',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    companyId: uuid('company_id')
      .notNull()
      .references(() => companies.id, { onDelete: 'cascade' }),
    /** Calendar month, "YYYY-MM". */
    month: text('month').notNull(),
    practiceMinutes: doublePrecision('practice_minutes').notNull().default(0),
    voiceMinutes: doublePrecision('voice_minutes').notNull().default(0),
    createdAt: createdAt(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    uniqueIndex('usage_company_month_idx').on(t.companyId, t.month),
    index('usage_company_created_idx').on(t.companyId, t.createdAt),
    check('usage_month_format', sql`${t.month} ~ '^[0-9]{4}-[0-9]{2}$'`),
  ],
);

/* ----------------------------------------------------------------- relations */

export const companiesRelations = relations(companies, ({ many }) => ({
  people: many(people),
  sessions: many(sessions),
  assignments: many(assignments),
  contentOverrides: many(contentOverrides),
  usage: many(usage),
}));

export const peopleRelations = relations(people, ({ one, many }) => ({
  company: one(companies, { fields: [people.companyId], references: [companies.id] }),
  sessions: many(sessions),
  assignments: many(assignments, { relationName: 'assignee' }),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  company: one(companies, { fields: [sessions.companyId], references: [companies.id] }),
  person: one(people, { fields: [sessions.personId], references: [people.id] }),
}));

export const assignmentsRelations = relations(assignments, ({ one }) => ({
  company: one(companies, { fields: [assignments.companyId], references: [companies.id] }),
  assignee: one(people, { fields: [assignments.assigneeId], references: [people.id], relationName: 'assignee' }),
  assignedBy: one(people, { fields: [assignments.assignedById], references: [people.id] }),
  completedSession: one(sessions, { fields: [assignments.completedSessionId], references: [sessions.id] }),
}));

export const contentOverridesRelations = relations(contentOverrides, ({ one }) => ({
  company: one(companies, { fields: [contentOverrides.companyId], references: [companies.id] }),
}));

export const usageRelations = relations(usage, ({ one }) => ({
  company: one(companies, { fields: [usage.companyId], references: [companies.id] }),
}));

export type Company = typeof companies.$inferSelect;
export type NewCompany = typeof companies.$inferInsert;
export type Person = typeof people.$inferSelect;
export type NewPerson = typeof people.$inferInsert;
export type Session = typeof sessions.$inferSelect;
export type NewSession = typeof sessions.$inferInsert;
export type Assignment = typeof assignments.$inferSelect;
export type NewAssignment = typeof assignments.$inferInsert;
export type ContentOverride = typeof contentOverrides.$inferSelect;
export type NewContentOverride = typeof contentOverrides.$inferInsert;
export type Usage = typeof usage.$inferSelect;
export type NewUsage = typeof usage.$inferInsert;
