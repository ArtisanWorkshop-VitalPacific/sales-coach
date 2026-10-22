/**
 * Seeds the fictional demo company, Summit Plumbing & Air: an owner, a service manager,
 * and six techs, plus a starter assignment, a content override, and this month's usage row.
 * Safe to run twice: existing rows are kept.
 *
 *   DATABASE_URL=postgres://... pnpm db:seed
 */
import { and, eq } from 'drizzle-orm';
import {
  assignments,
  companies,
  contentOverrides,
  createDb,
  type NewPerson,
  people,
  usage,
} from './index';

const COMPANY = {
  name: 'Summit Plumbing & Air',
  slug: 'summit-plumbing-air',
  tier: 'pro' as const,
  trucks: 8,
};

/** Fictional people. Any resemblance to real technicians is a coincidence. */
const PEOPLE: Omit<NewPerson, 'companyId'>[] = [
  { name: 'Dana Whitfield', role: 'owner' },
  { name: 'Marcus Bell', role: 'manager', servicetitanTechnicianId: 'demo-mgr-01' },
  { name: 'Luis Ortega', role: 'tech', servicetitanTechnicianId: 'demo-tech-01' },
  { name: 'Tyler Brooks', role: 'tech', servicetitanTechnicianId: 'demo-tech-02' },
  { name: 'Aisha Rahman', role: 'tech', servicetitanTechnicianId: 'demo-tech-03' },
  { name: 'Cody Nguyen', role: 'tech', servicetitanTechnicianId: 'demo-tech-04' },
  { name: 'Ben Kowalczyk', role: 'tech', servicetitanTechnicianId: 'demo-tech-05' },
  { name: 'Jordan Reyes', role: 'tech', servicetitanTechnicianId: 'demo-tech-06' },
];

async function main() {
  if (!process.env.DATABASE_URL) {
    console.error('Set DATABASE_URL to your Neon connection string, then run pnpm db:seed again.');
    process.exitCode = 1;
    return;
  }
  const db = createDb();

  await db.insert(companies).values(COMPANY).onConflictDoNothing({ target: companies.slug });
  const [company] = await db
    .select()
    .from(companies)
    .where(eq(companies.slug, COMPANY.slug))
    .limit(1);
  if (!company) throw new Error('Could not create the demo company');

  const existing = await db.select().from(people).where(eq(people.companyId, company.id));
  const missing = PEOPLE.filter((p) => !existing.some((e) => e.name === p.name));
  if (missing.length)
    await db.insert(people).values(missing.map((p) => ({ ...p, companyId: company.id })));
  const staff = await db.select().from(people).where(eq(people.companyId, company.id));
  const manager = staff.find((p) => p.role === 'manager');
  const firstTech = staff.find((p) => p.role === 'tech' && p.name === 'Luis Ortega');

  // One starter assignment: hold the silence after the price.
  if (manager && firstTech) {
    const already = await db
      .select({ id: assignments.id })
      .from(assignments)
      .where(
        and(eq(assignments.assigneeId, firstTech.id), eq(assignments.drillId, 'hold-the-silence')),
      )
      .limit(1);
    if (already.length === 0) {
      await db.insert(assignments).values({
        companyId: company.id,
        assignedById: manager.id,
        assigneeId: firstTech.id,
        drillId: 'hold-the-silence',
        note: 'Say the price, then let it land.',
        dueAt: new Date(Date.now() + 7 * 24 * 3600_000),
      });
    }
  }

  await db
    .insert(contentOverrides)
    .values({
      companyId: company.id,
      version: 1,
      objectionAnswers: [
        {
          moveId: 'need-three-bids',
          answer:
            'Makes sense. I will leave you a written, itemized quote so you can compare line by line.',
        },
      ],
      scripts: {
        preferred: [
          {
            moment: 'door',
            line: 'Hi, I am with Summit. Before I touch anything, I will walk you through how I work.',
          },
        ],
        banned: ['today only'],
      },
      priceRanges: [
        {
          id: 'water-heater-replacement',
          item: 'Water heater replacement, 40 to 50 gallon gas',
          low: 1790,
          high: 2690,
          source: 'Fictional demo range',
        },
      ],
      createdById: manager?.id,
    })
    .onConflictDoNothing();

  const month = new Date().toISOString().slice(0, 7);
  await db.insert(usage).values({ companyId: company.id, month }).onConflictDoNothing();

  console.log(`Seeded ${company.name} (${company.id}) with ${staff.length} people.`);
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
