import type { JobContext } from '@sales-coach/engine';
import { ServiceTitanClient, type ServiceTitanConfig, type ServiceTitanEnv } from './client';
import { toJobContext } from './mapping';

export * from './client';
export * from './mapping';

export interface NextAppointment {
  appointmentId: string;
  jobId: string;
  start: string;
  end?: string;
}

/**
 * The two calls the app needs: what is this tech's next appointment, and what does the
 * job look like (first name only). Built from env with `fromEnv()`.
 */
export class ServiceTitan {
  readonly client: ServiceTitanClient;
  private readonly now: () => number;

  constructor(config: ServiceTitanConfig) {
    this.client = new ServiceTitanClient(config);
    this.now = config.now ?? (() => Date.now());
  }

  /** The soonest appointment assigned to the technician that has not ended yet. */
  async nextAppointmentForTechnician(technicianId: string): Promise<NextAppointment | null> {
    const assignments = await this.client.assignments(technicianId);
    const ids = [...new Set(assignments.data.filter((a) => a.active !== false).map((a) => a.appointmentId))];
    if (ids.length === 0) return null;
    const appts = await this.client.appointments(ids.slice(0, 50));
    const now = this.now();
    const upcoming = appts.data
      .filter((a) => !/cancel|done|complete/i.test(a.status ?? ''))
      .filter((a) => {
        const end = a.end ? Date.parse(a.end) : Date.parse(a.start) + 2 * 3600_000;
        return Number.isFinite(end) && end > now;
      })
      .sort((a, b) => Date.parse(a.start) - Date.parse(b.start));
    const next = upcoming[0];
    if (!next) return null;
    return { appointmentId: next.id, jobId: next.jobId, start: next.start, end: next.end ?? undefined };
  }

  /** The job as a JobContext: type, equipment with ages, membership, declined estimates. */
  async jobContext(jobId: string, scheduledFor?: string): Promise<JobContext> {
    const job = await this.client.job(jobId);
    const [jobType, customer, equipment, memberships, estimates] = await Promise.all([
      job.jobTypeId ? this.client.jobType(job.jobTypeId).catch(() => null) : Promise.resolve(null),
      this.client.customer(job.customerId),
      job.locationId ? this.client.installedEquipment(job.locationId).then((r) => r.data).catch(() => []) : Promise.resolve([]),
      this.client.memberships(job.customerId).then((r) => r.data).catch(() => []),
      this.client.dismissedEstimates(job.customerId).then((r) => r.data).catch(() => []),
    ]);
    return toJobContext({
      job,
      jobTypeName: jobType?.name,
      customer,
      equipment,
      memberships,
      declinedEstimates: estimates,
      scheduledFor,
      now: this.now(),
    });
  }

  /** Next appointment plus its job context, or null when nothing is scheduled. */
  async nextJobForTechnician(technicianId: string): Promise<JobContext | null> {
    const next = await this.nextAppointmentForTechnician(technicianId);
    return next ? this.jobContext(next.jobId, next.start) : null;
  }
}

/** Reads SERVICETITAN_* env vars. Returns null when the integration is not configured. */
export function fromEnv(env: Record<string, string | undefined> = process.env, fetchImpl?: typeof fetch): ServiceTitan | null {
  const clientId = env.SERVICETITAN_CLIENT_ID?.trim();
  const clientSecret = env.SERVICETITAN_CLIENT_SECRET?.trim();
  const appKey = env.SERVICETITAN_APP_KEY?.trim();
  const tenantId = env.SERVICETITAN_TENANT_ID?.trim();
  if (!clientId || !clientSecret || !appKey || !tenantId) return null;
  const envName: ServiceTitanEnv = env.SERVICETITAN_ENV?.trim().toLowerCase() === 'production' ? 'production' : 'integration';
  return new ServiceTitan({ clientId, clientSecret, appKey, tenantId, env: envName, fetch: fetchImpl });
}

/** A realistic, fictional job for demo mode ("Rehearse a sample job"). */
export function demoJob(now = Date.now()): JobContext {
  const tomorrow = new Date(now + 24 * 3600_000);
  tomorrow.setUTCHours(16, 0, 0, 0);
  return {
    source: 'demo',
    jobId: 'demo-48213',
    customerFirstName: 'Margaret',
    jobType: 'water-heater-replacement',
    scheduledFor: tomorrow.toISOString(),
    summary: 'No hot water since yesterday morning. Customer says there is water on the garage floor around the tank.',
    equipment: [
      { item: '40-gallon atmospheric gas water heater', ageYears: 12 },
      { item: 'Pressure regulator', ageYears: 18 },
    ],
    isMember: false,
    priorDeclinedEstimates: ['Water heater flush and anode check ($189), Mar 2024'],
    notes: ['Cat indoors. Keep the garage door to the house closed.', 'Prefers a call 30 minutes before arrival.'],
  };
}
