import { JobContext } from '@sales-coach/engine';
import { describe, expect, it } from 'vitest';
import {
  ageInYears,
  demoJob,
  fromEnv,
  mapJobType,
  ServiceTitan,
  scrubText,
  splitName,
} from '../src';

const NOW = Date.parse('2026-10-22T15:00:00Z');

/** A fake ServiceTitan tenant. Records are full of personal details on purpose. */
const FIXTURES: Record<string, unknown> = {
  '/jpm/v2/tenant/777/jobs/9001': {
    id: 9001,
    jobNumber: '9001',
    customerId: 501,
    locationId: 601,
    jobTypeId: 31,
    jobStatus: 'Scheduled',
    summary:
      '<p>Mrs. Ellis reports no hot water, water on garage floor. Call Margaret Ellis at (951) 555-0142 or margaret.ellis@example.com. ' +
      'Address 41250 Via Rosa Dr, Unit 4, Murrieta CA 92562. Gate code 4471. Son Kevin Ellis may call.</p>',
  },
  '/jpm/v2/tenant/777/job-types/31': { id: 31, name: 'WH - Replace (Gas Tank)' },
  '/crm/v2/tenant/777/customers/501': {
    id: 501,
    name: 'Ellis, Margaret',
    type: 'Residential',
    address: { street: '41250 Via Rosa Dr', unit: '4', city: 'Murrieta', state: 'CA', zip: '92562' },
    phoneSettings: [{ phoneNumber: '9515550142' }],
    email: 'margaret.ellis@example.com',
    balance: 0,
  },
  '/equipmentsystems/v2/tenant/777/installed-equipment': {
    page: 1,
    pageSize: 50,
    hasMore: false,
    data: [
      { id: 1, name: '40 Gal Gas Water Heater', manufacturer: 'Rheem', model: 'XG40T06EN38U1', serialNumber: 'Q4114R0012', installedOn: '2014-06-10T00:00:00Z', active: true },
      { id: 2, name: 'PRV', installedOn: '2008-02-01T00:00:00Z', active: true },
      { id: 3, name: 'Old softener', installedOn: '2001-01-01T00:00:00Z', active: false },
    ],
  },
  '/memberships/v2/tenant/777/memberships': {
    page: 1,
    pageSize: 10,
    hasMore: false,
    data: [{ id: 77, status: 'Active', active: true, customerId: 501 }],
  },
  '/sales/v2/tenant/777/estimates': {
    page: 1,
    pageSize: 20,
    hasMore: false,
    data: [
      { id: 3001, jobId: 8001, name: 'Water heater flush for Margaret Ellis', status: { name: 'Dismissed' }, subtotal: 189, createdOn: '2024-03-14T18:00:00Z', summary: 'Customer at 41250 Via Rosa Dr declined, call (951) 555-0142' },
      { id: 3002, jobId: 8002, name: 'Expansion tank', status: { name: 'Dismissed' }, subtotal: 325.5, createdOn: '2025-01-02T18:00:00Z' },
    ],
  },
  '/dispatch/v2/tenant/777/appointment-assignments': {
    page: 1,
    pageSize: 100,
    hasMore: false,
    data: [
      { id: 1, technicianId: 42, jobId: 9000, appointmentId: 7000, active: true },
      { id: 2, technicianId: 42, jobId: 9001, appointmentId: 7001, active: true },
      { id: 3, technicianId: 42, jobId: 9002, appointmentId: 7002, active: true },
    ],
  },
  '/jpm/v2/tenant/777/appointments': {
    page: 1,
    pageSize: 50,
    hasMore: false,
    data: [
      { id: 7000, jobId: 9000, start: '2026-10-22T13:00:00Z', end: '2026-10-22T14:00:00Z', status: 'Done' },
      { id: 7002, jobId: 9002, start: '2026-10-23T16:00:00Z', end: '2026-10-23T18:00:00Z', status: 'Scheduled' },
      { id: 7001, jobId: 9001, start: '2026-10-22T17:00:00Z', end: '2026-10-22T19:00:00Z', status: 'Scheduled' },
    ],
  },
};

function fakeTenant() {
  const calls: { url: string; init?: RequestInit }[] = [];
  let tokens = 0;
  const fetchImpl = (async (input: string | URL | Request, init?: RequestInit) => {
    const url = new URL(String(input));
    calls.push({ url: url.toString(), init });
    if (url.pathname === '/connect/token') {
      tokens += 1;
      return new Response(JSON.stringify({ access_token: `tok-${tokens}`, expires_in: 900, token_type: 'Bearer' }), { status: 200 });
    }
    const body = FIXTURES[url.pathname];
    if (!body) return new Response('not found', { status: 404 });
    return new Response(JSON.stringify(body), { status: 200 });
  }) as typeof fetch;
  return { fetchImpl, calls, tokenCount: () => tokens };
}

function client(now = () => NOW) {
  const t = fakeTenant();
  const st = new ServiceTitan({
    clientId: 'cid',
    clientSecret: 'secret',
    appKey: 'app-key',
    tenantId: '777',
    env: 'integration',
    fetch: t.fetchImpl,
    now,
  });
  return { st, ...t };
}

describe('auth', () => {
  it('uses client credentials, sends Bearer and ST-App-Key, and caches the token until expiry', async () => {
    let now = NOW;
    const { st, calls, tokenCount } = client(() => now);
    await st.client.job('9001');
    await st.client.job('9001');
    expect(tokenCount()).toBe(1);

    const tokenCall = calls.find((c) => c.url.includes('/connect/token'))!;
    expect(tokenCall.url).toBe('https://auth-integration.servicetitan.io/connect/token');
    expect(String(tokenCall.init?.body)).toContain('grant_type=client_credentials');
    const apiCall = calls.find((c) => c.url.includes('/jpm/'))!;
    expect(apiCall.url).toBe('https://api-integration.servicetitan.io/jpm/v2/tenant/777/jobs/9001');
    const headers = apiCall.init?.headers as Record<string, string>;
    expect(headers.Authorization).toBe('Bearer tok-1');
    expect(headers['ST-App-Key']).toBe('app-key');

    now += 15 * 60_000; // past expiry
    await st.client.job('9001');
    expect(tokenCount()).toBe(2);
  });
});

describe('nextAppointmentForTechnician', () => {
  it('returns the soonest appointment that has not ended', async () => {
    const { st } = client();
    const next = await st.nextAppointmentForTechnician('42');
    expect(next).toEqual({ appointmentId: '7001', jobId: '9001', start: '2026-10-22T17:00:00Z', end: '2026-10-22T19:00:00Z' });
  });
});

describe('jobContext', () => {
  it('maps the job: first name, job type, equipment ages, membership, declined estimates', async () => {
    const { st } = client();
    const ctx = await st.jobContext('9001', '2026-10-22T17:00:00Z');
    expect(JobContext.parse(ctx)).toEqual(ctx);
    expect(ctx.source).toBe('servicetitan');
    expect(ctx.customerFirstName).toBe('Margaret');
    expect(ctx.jobType).toBe('water-heater-replacement');
    expect(ctx.equipment).toEqual([
      { item: '40 Gal Gas Water Heater', ageYears: 12 },
      { item: 'PRV', ageYears: 18 },
    ]);
    expect(ctx.isMember).toBe(true);
    expect(ctx.priorDeclinedEstimates).toEqual(['Water heater flush for ($189), Mar 2024', 'Expansion tank ($326), Jan 2025']);
    expect(ctx.summary).toContain('no hot water');
  });

  it('never carries last names, phones, emails, addresses, ZIPs, or access codes', async () => {
    const { st } = client();
    const json = JSON.stringify(await st.jobContext('9001'));
    for (const banned of ['Ellis', 'ellis', '555', '0142', '@', 'example.com', 'Via Rosa', '41250', '92562', 'Unit 4', '4471', 'Murrieta', 'Rheem', 'Q4114R0012']) {
      expect(json, `leaked "${banned}"`).not.toContain(banned);
    }
    expect(json).toContain('Margaret');
  });
});

describe('mapping helpers', () => {
  it('maps ServiceTitan job type names to our job types', () => {
    expect(mapJobType('WH - Replace (Gas Tank)')).toBe('water-heater-replacement');
    expect(mapJobType('Water Heater Install')).toBe('water-heater-replacement');
    expect(mapJobType('Water Heater Repair - No Hot Water')).toBe('water-heater-repair');
    expect(mapJobType('Water Heater Flush')).toBe('water-heater-service');
    expect(mapJobType('Tankless Descale')).toBe('tankless-service');
    expect(mapJobType('Drain Cleaning - Kitchen')).toBe('drain-cleaning');
    expect(mapJobType('Main Line Camera Inspection')).toBe('sewer-inspection');
    expect(mapJobType('Gas Leak / Smell Gas')).toBe('gas-leak-repair');
    expect(mapJobType('Spa Heater Wiring')).toBe('spa-heater-wiring');
    expect(mapJobType('')).toBe('service-call');
  });

  it('splits names to a first name and scrubs the rest', () => {
    expect(splitName({ name: 'Ellis, Margaret', type: 'Residential' })).toEqual({ first: 'Margaret', others: ['Ellis'] });
    expect(splitName({ name: 'Mrs. Margaret Ellis', type: 'Residential' }).first).toBe('Margaret');
    expect(splitName({ name: 'Acme Property Group', type: 'Commercial' }).first).toBeUndefined();
    expect(scrubText('Call Bob Smith at 951-555-0142, bob@x.co, 12 Elm St 92562', ['Smith'])).toBe('Call Bob at,,');
  });

  it('computes equipment age in whole years', () => {
    expect(ageInYears('2014-06-10T00:00:00Z', NOW)).toBe(12);
    expect(ageInYears('2030-01-01T00:00:00Z', NOW)).toBeUndefined();
    expect(ageInYears(null, NOW)).toBeUndefined();
  });
});

describe('factories', () => {
  it('fromEnv returns null until every credential is set', () => {
    expect(fromEnv({})).toBeNull();
    expect(fromEnv({ SERVICETITAN_CLIENT_ID: 'a', SERVICETITAN_CLIENT_SECRET: 'b', SERVICETITAN_APP_KEY: 'c' })).toBeNull();
    const st = fromEnv({
      SERVICETITAN_CLIENT_ID: 'a',
      SERVICETITAN_CLIENT_SECRET: 'b',
      SERVICETITAN_APP_KEY: 'c',
      SERVICETITAN_TENANT_ID: 'd',
      SERVICETITAN_ENV: 'production',
    });
    expect(st).toBeInstanceOf(ServiceTitan);
    expect(st?.client.tenantId).toBe('d');
  });

  it('demoJob is a valid first-name-only JobContext', () => {
    const job = demoJob(NOW);
    expect(JobContext.parse(job)).toEqual(job);
    expect(job.source).toBe('demo');
    expect(job.customerFirstName).toBe('Margaret');
  });
});
