import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { createApp } from '../../src/app.js';
import { InMemoryServiceRequestRepository } from '../../src/infrastructure/repositories/InMemoryServiceRequestRepository.js';
import { DomainEventDispatcher } from '../../src/domain/events/DomainEventDispatcher.js';
import { RequestStatus } from '../../src/domain/enums/RequestStatus.js';

/**
 * End-to-End (E2E) System Test Suite: Operational Resilience & System Contracts
 * Governing Standards: SEN381 Milestone 3 Brief §3, §10, §13; Master Project Brief §15 & §17
 * Test Case ID: TC-E2E-RES-01
 * Traced Requirements: NFR-001, NFR-002, NFR-010 (Cost/Memory Budget), FR-004, FR-006, FR-007
 */
describe('E2E User Journey: Operational Resilience, Contracts & Health Probes (TC-E2E-RES-01)', () => {
  let repository: InMemoryServiceRequestRepository;
  let app: any;

  beforeEach(() => {
    DomainEventDispatcher.getInstance().clearObservers();
    repository = new InMemoryServiceRequestRepository();
    app = createApp(repository);
  });

  it('verifies operational health probes, error contract boundaries, query filtering, and bulk POPIA projections', async () => {
    // -------------------------------------------------------------------------
    // Part 1: Operational Health & Liveness Probes (NFR-002, NFR-010)
    // -------------------------------------------------------------------------
    const healthRes = await request(app).get('/health/live');

    expect(healthRes.status).toBe(200);
    expect(healthRes.body.status).toBe('UP');
    expect(healthRes.body).toHaveProperty('uptimeSeconds');
    expect(healthRes.body.uptimeSeconds).toBeGreaterThanOrEqual(0);
    expect(healthRes.body).toHaveProperty('memoryUsageMB');
    // Enforces NFR-010 zero-cost sustainability: process memory must stay well under the 512MB container quota
    expect(healthRes.body.memoryUsageMB).toBeGreaterThan(0);
    expect(healthRes.body.memoryUsageMB).toBeLessThan(512);

    // -------------------------------------------------------------------------
    // Part 2: Error Contract Boundaries & Stack Trace Sanitization (SO16, NFR-004)
    // -------------------------------------------------------------------------
    // 2A: Unknown route returns uniform 404 contract without internal leak
    const unknownRouteRes = await request(app).get('/api/v1/invalid-route-endpoint');
    expect(unknownRouteRes.status).toBe(404);
    expect(unknownRouteRes.body).toEqual({ error: 'Endpoint not found.' });

    // 2B: Non-existent ticket lookup returns clean 404 domain error
    const missingTicketRes = await request(app).get('/api/v1/requests/00000000-0000-0000-0000-000000000000');
    expect(missingTicketRes.status).toBe(404);
    expect(missingTicketRes.body.error).toContain('not found');

    // 2C: Malformed empty payload returns 400 Bad Request with field validation contract
    const malformedPayloadRes = await request(app)
      .post('/api/v1/requests')
      .set('x-user-role', 'REQUESTER')
      .send({});

    expect(malformedPayloadRes.status).toBe(400);
    expect(malformedPayloadRes.body.error).toContain('Missing mandatory fields');

    // -------------------------------------------------------------------------
    // Part 3: Multi-Department Intake, Query Filtering & Pagination (FR-004, FR-006, FR-007)
    // -------------------------------------------------------------------------
    // Seed polymorphic tickets across Facilities (Dept 1), IT (Dept 2), and Security (Dept 3)
    const ticket1Res = await request(app)
      .post('/api/v1/requests')
      .set('x-user-role', 'REQUESTER')
      .set('x-user-id', 'citizen-dept-01')
      .send({
        categoryCode: 'FAC_FAULT',
        title: 'Broken window in Building B',
        description: 'Glass pane cracked after hail storm',
        locationAddress: 'Building B, Room 201',
        isAnonymizedDisplay: true
      });
    expect(ticket1Res.status).toBe(201);

    const ticket2Res = await request(app)
      .post('/api/v1/requests')
      .set('x-user-role', 'REQUESTER')
      .set('x-user-id', 'citizen-dept-02')
      .send({
        categoryCode: 'IT_SUPPORT',
        title: 'Network switch offline in Lab 1',
        description: 'Switch port 24 blinking orange; no link',
        locationAddress: 'Lab 1, Server Rack A',
        isAnonymizedDisplay: false
      });
    expect(ticket2Res.status).toBe(201);

    const ticket3Res = await request(app)
      .post('/api/v1/requests')
      .set('x-user-role', 'REQUESTER')
      .set('x-user-id', 'citizen-dept-03')
      .send({
        categoryCode: 'SECURITY_HAZARD',
        title: 'Emergency exit blocked in Library',
        description: 'Chairs stacked against exit door #2',
        locationAddress: 'Library, Exit Door 2',
        isAnonymizedDisplay: true
      });
    expect(ticket3Res.status).toBe(201);

    // 3A: Department-isolated queue query (Dept 1: Facilities)
    const dept1Res = await request(app)
      .get('/api/v1/requests?departmentId=1')
      .set('x-user-role', 'STAFF');

    expect(dept1Res.status).toBe(200);
    expect(dept1Res.body.requests.length).toBeGreaterThanOrEqual(1);
    for (const reqItem of dept1Res.body.requests) {
      expect(reqItem.departmentId).toBe(1);
      expect(reqItem.categoryCode).toBe('FAC_FAULT');
    }

    // 3B: Pagination limit verification (limit=2 on total of 3 items)
    const paginatedRes = await request(app)
      .get('/api/v1/requests?limit=2&page=1')
      .set('x-user-role', 'STAFF');

    expect(paginatedRes.status).toBe(200);
    expect(paginatedRes.body.totalCount).toBe(3);
    expect(paginatedRes.body.requests).toHaveLength(2);

    // 3C: Bulk collection POPIA masking check for STAFF vs ADMIN
    const staffListRes = await request(app)
      .get('/api/v1/requests')
      .set('x-user-role', 'STAFF');

    expect(staffListRes.status).toBe(200);
    const anonymizedInStaff = staffListRes.body.requests.find((r: any) => r.requester.isAnonymized === true);
    expect(anonymizedInStaff).toBeDefined();
    expect(anonymizedInStaff.requester.userId).toBe('[POPIA PROTECTED]');
    expect(anonymizedInStaff.requester.displayName).toBe('Community Requester (Anonymous)');

    // Admin role unmasks all records
    const adminListRes = await request(app)
      .get('/api/v1/requests')
      .set('x-user-role', 'ADMIN');

    expect(adminListRes.status).toBe(200);
    const anonymizedInAdmin = adminListRes.body.requests.find((r: any) => r.requester.isAnonymized === true);
    expect(anonymizedInAdmin).toBeDefined();
    expect(anonymizedInAdmin.requester.userId).not.toBe('[POPIA PROTECTED]');
  });
});
