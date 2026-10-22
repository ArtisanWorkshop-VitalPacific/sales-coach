import { z } from 'zod';

/**
 * Minimal typed client for the ServiceTitan public API (v2).
 *
 * Auth is OAuth2 client credentials. Every request carries `Authorization: Bearer <token>`
 * and `ST-App-Key`. The tenant id goes in the path.
 *
 * Endpoint paths follow the ServiceTitan v2 API reference. The developer portal needs a
 * login, so paths marked "verify" were not re-checked against it for this build.
 *
 * Privacy: response schemas list only the fields we use. zod drops everything else
 * (addresses, phone numbers, emails, contacts) at parse time, before any mapping happens.
 */

export type ServiceTitanEnv = 'integration' | 'production';

export interface ServiceTitanConfig {
  clientId: string;
  clientSecret: string;
  appKey: string;
  tenantId: string;
  env: ServiceTitanEnv;
  /** Injectable for tests. Defaults to the global fetch. */
  fetch?: typeof fetch;
  /** Injectable clock for token expiry. */
  now?: () => number;
}

export const HOSTS: Record<ServiceTitanEnv, { auth: string; api: string }> = {
  integration: {
    auth: 'https://auth-integration.servicetitan.io/connect/token',
    api: 'https://api-integration.servicetitan.io',
  },
  production: {
    auth: 'https://auth.servicetitan.io/connect/token',
    api: 'https://api.servicetitan.io',
  },
};

/* ------------------------------------------------------------ response shapes */

const Id = z.union([z.number(), z.string()]).transform((v) => String(v));
const Paged = <T extends z.ZodType>(item: T) =>
  z.object({
    page: z.number().optional(),
    pageSize: z.number().optional(),
    hasMore: z.boolean().optional(),
    data: z.array(item),
  });

const TokenResponse = z.object({
  access_token: z.string(),
  expires_in: z.number().default(900),
  token_type: z.string().optional(),
});

export const StJob = z.object({
  id: Id,
  customerId: Id,
  locationId: Id.optional(),
  jobTypeId: Id.optional().nullable(),
  jobStatus: z.string().optional(),
  summary: z.string().optional().nullable(),
});
export type StJob = z.infer<typeof StJob>;

export const StJobType = z.object({ id: Id, name: z.string() });
export type StJobType = z.infer<typeof StJobType>;

/** Name and type only. Address, contacts, and balances are never read. */
export const StCustomer = z.object({
  id: Id,
  name: z.string().optional().nullable(),
  type: z.string().optional().nullable(),
});
export type StCustomer = z.infer<typeof StCustomer>;

export const StAppointment = z.object({
  id: Id,
  jobId: Id,
  start: z.string(),
  end: z.string().optional().nullable(),
  status: z.string().optional().nullable(),
});
export type StAppointment = z.infer<typeof StAppointment>;

export const StAssignment = z.object({
  id: Id,
  technicianId: Id,
  jobId: Id,
  appointmentId: Id,
  active: z.boolean().optional(),
});
export type StAssignment = z.infer<typeof StAssignment>;

export const StInstalledEquipment = z.object({
  id: Id,
  name: z.string().optional().nullable(),
  manufacturer: z.string().optional().nullable(),
  model: z.string().optional().nullable(),
  installedOn: z.string().optional().nullable(),
  active: z.boolean().optional(),
});
export type StInstalledEquipment = z.infer<typeof StInstalledEquipment>;

export const StMembership = z.object({
  id: Id,
  status: z.string().optional().nullable(),
  active: z.boolean().optional(),
});
export type StMembership = z.infer<typeof StMembership>;

export const StEstimate = z.object({
  id: Id,
  jobId: Id.optional().nullable(),
  name: z.string().optional().nullable(),
  status: z.union([z.object({ name: z.string().optional() }), z.string()]).optional().nullable(),
  subtotal: z.number().optional().nullable(),
  createdOn: z.string().optional().nullable(),
});
export type StEstimate = z.infer<typeof StEstimate>;

export class ServiceTitanError extends Error {
  constructor(
    message: string,
    readonly status?: number,
  ) {
    super(message);
    this.name = 'ServiceTitanError';
  }
}

/* --------------------------------------------------------------------- client */

export class ServiceTitanClient {
  private readonly cfg: ServiceTitanConfig;
  private readonly fetchImpl: typeof fetch;
  private readonly now: () => number;
  private token: { value: string; expiresAt: number } | null = null;
  private inflight: Promise<string> | null = null;

  constructor(cfg: ServiceTitanConfig) {
    this.cfg = cfg;
    this.fetchImpl = cfg.fetch ?? ((...args) => fetch(...args));
    this.now = cfg.now ?? (() => Date.now());
  }

  get tenantId() {
    return this.cfg.tenantId;
  }

  /** A cached access token, refreshed one minute before it expires. */
  async accessToken(): Promise<string> {
    if (this.token && this.now() < this.token.expiresAt - 60_000) return this.token.value;
    // One refresh at a time, even with parallel requests.
    this.inflight ??= this.fetchToken().finally(() => {
      this.inflight = null;
    });
    return this.inflight;
  }

  private async fetchToken(): Promise<string> {
    const body = new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: this.cfg.clientId,
      client_secret: this.cfg.clientSecret,
    });
    const res = await this.fetchImpl(HOSTS[this.cfg.env].auth, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded', Accept: 'application/json' },
      body: body.toString(),
    });
    if (!res.ok) throw new ServiceTitanError(`ServiceTitan auth failed (${res.status})`, res.status);
    const t = TokenResponse.parse(await res.json());
    this.token = { value: t.access_token, expiresAt: this.now() + t.expires_in * 1000 };
    return t.access_token;
  }

  /** GET a tenant-scoped path, e.g. `jpm/v2/tenant/{tenant}/jobs/1`. `{tenant}` is filled in. */
  async get<T extends z.ZodType>(path: string, schema: T, query: Record<string, string | number | boolean | undefined> = {}): Promise<z.infer<T>> {
    const url = new URL(`${HOSTS[this.cfg.env].api}/${path.replace('{tenant}', encodeURIComponent(this.cfg.tenantId)).replace(/^\//, '')}`);
    for (const [k, v] of Object.entries(query)) if (v !== undefined) url.searchParams.set(k, String(v));
    const send = async () =>
      this.fetchImpl(url.toString(), {
        headers: {
          Authorization: `Bearer ${await this.accessToken()}`,
          'ST-App-Key': this.cfg.appKey,
          Accept: 'application/json',
        },
      });
    let res = await send();
    if (res.status === 401) {
      // Token revoked or expired early: refresh once and retry.
      this.token = null;
      res = await send();
    }
    if (!res.ok) throw new ServiceTitanError(`ServiceTitan GET ${url.pathname} failed (${res.status})`, res.status);
    return schema.parse(await res.json());
  }

  /* ----------------------------------------------------------------- endpoints */

  job(jobId: string) {
    return this.get(`jpm/v2/tenant/{tenant}/jobs/${encodeURIComponent(jobId)}`, StJob);
  }

  jobType(jobTypeId: string) {
    return this.get(`jpm/v2/tenant/{tenant}/job-types/${encodeURIComponent(jobTypeId)}`, StJobType);
  }

  /** Appointments by id. verify: `ids` filter on jpm appointments. */
  appointments(ids: string[]) {
    return this.get('jpm/v2/tenant/{tenant}/appointments', Paged(StAppointment), { ids: ids.join(','), pageSize: 50 });
  }

  /** Active assignments for one technician. verify: `technicianIds` and `active` filters. */
  assignments(technicianId: string) {
    return this.get('dispatch/v2/tenant/{tenant}/appointment-assignments', Paged(StAssignment), {
      technicianIds: technicianId,
      active: true,
      pageSize: 100,
    });
  }

  customer(customerId: string) {
    return this.get(`crm/v2/tenant/{tenant}/customers/${encodeURIComponent(customerId)}`, StCustomer);
  }

  /** verify: `locationIds` filter on installed equipment. */
  installedEquipment(locationId: string) {
    return this.get('equipmentsystems/v2/tenant/{tenant}/installed-equipment', Paged(StInstalledEquipment), {
      locationIds: locationId,
      pageSize: 50,
    });
  }

  /** verify: `customerIds` and `status` filters on memberships. */
  memberships(customerId: string) {
    return this.get('memberships/v2/tenant/{tenant}/memberships', Paged(StMembership), {
      customerIds: customerId,
      status: 'Active',
      pageSize: 10,
    });
  }

  /** verify: `customerId` and `status` filters on estimates. Dismissed is ServiceTitan's "declined". */
  dismissedEstimates(customerId: string) {
    return this.get('sales/v2/tenant/{tenant}/estimates', Paged(StEstimate), {
      customerId,
      status: 'Dismissed',
      pageSize: 20,
    });
  }
}
