import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { createApp } from '../../src/app.js';
import { InMemoryServiceRequestRepository } from '../../src/infrastructure/repositories/InMemoryServiceRequestRepository.js';

describe('CivicConnect REST API Integration (OpenAPI 3.0 & NFR-001/NFR-002)', () => {
  let repository: InMemoryServiceRequestRepository;
  let app: any;

  beforeEach(() => {
    repository = new InMemoryServiceRequestRepository();
    app = createApp(repository);
  });

  it('GET /health/live should return HTTP 200 with process health data (NFR-002)', async () => {
    const response = await request(app).get('/health/live');

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('UP');
    expect(response.body).toHaveProperty('uptimeSeconds');
    expect(response.body).toHaveProperty('memoryUsageMB');
  });

  it('POST /api/v1/requests should create a request and return HTTP 201 (FR-001, ADR-005)', async () => {
    const payload = {
      categoryCode: 'FAC_FAULT',
      title: 'Broken ceiling tile',
      description: 'Tile collapsed in hallway after rain',
      locationAddress: 'Building C, Room 102'
    };

    const response = await request(app)
      .post('/api/v1/requests')
      .send(payload);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('requestId');
    expect(response.body.referenceNumber).toMatch(/^REQ-\d{4}-\d{4}$/);
    expect(response.body.status).toBe('SUBMITTED');
    expect(response.body.version).toBe(1);
  });

  it('PATCH /api/v1/requests/:id/assign should enforce OCC and return HTTP 409 on version conflict (ADR-006)', async () => {
    // 1. Create ticket
    const createRes = await request(app)
      .post('/api/v1/requests')
      .send({
        categoryCode: 'IT_SUPPORT',
        title: 'Projector bulb burned out',
        description: 'Classroom projector bulb blown during lecture',
        locationAddress: 'Main Auditorium, Room A1'
      });

    const ticketId = createRes.body.requestId;

    // 2. Successful assignment with current expectedVersion: 1
    const assignRes1 = await request(app)
      .patch(`/api/v1/requests/${ticketId}/assign`)
      .send({ staffId: 'staff-tech-01', expectedVersion: 1 });

    expect(assignRes1.status).toBe(200);
    expect(assignRes1.body.status).toBe('ASSIGNED');
    expect(assignRes1.body.version).toBe(2);

    // 3. Concurrent assignment attempt using stale version 1 -> should return 409 Conflict!
    const assignRes2 = await request(app)
      .patch(`/api/v1/requests/${ticketId}/assign`)
      .send({ staffId: 'staff-tech-02', expectedVersion: 1 });

    expect(assignRes2.status).toBe(409);
    expect(assignRes2.body.error).toContain('Concurrency conflict');
  });

  it('PATCH /api/v1/requests/:id/assign should reject non-staff assignment with HTTP 403 Forbidden (NFR-004)', async () => {
    const createRes = await request(app)
      .post('/api/v1/requests')
      .send({
        categoryCode: 'IT_SUPPORT',
        title: 'Network printer offline',
        description: 'Computer lab printer not responding on network',
        locationAddress: 'Lab 3, Terminal 12'
      });

    const ticketId = createRes.body.requestId;

    // Attempt assignment as citizen / requester
    const unauthorizedRes = await request(app)
      .patch(`/api/v1/requests/${ticketId}/assign`)
      .set('x-user-role', 'REQUESTER')
      .send({ staffId: 'staff-tech-01', expectedVersion: 1 });

    expect(unauthorizedRes.status).toBe(403);
    expect(unauthorizedRes.body.error).toContain('Forbidden');
  });

  it('GET /api/v1/requests/:id should mask citizen PII for STAFF and unmask for ADMIN (FR-008, NFR-005)', async () => {
    const createRes = await request(app)
      .post('/api/v1/requests')
      .set('x-user-id', 'citizen-jane-doe')
      .send({
        categoryCode: 'FAC_FAULT',
        title: 'Water pipe leaking',
        description: 'Active water leak near electrical cabinet',
        locationAddress: 'Building A, Room 101',
        isAnonymizedDisplay: true
      });

    const ticketId = createRes.body.requestId;

    // 1. Query as STAFF (default) -> citizen identity should be masked
    const staffRes = await request(app)
      .get(`/api/v1/requests/${ticketId}`)
      .set('x-user-role', 'STAFF');

    expect(staffRes.status).toBe(200);
    expect(staffRes.body.requester.userId).toBe('[POPIA PROTECTED]');
    expect(staffRes.body.requester.displayName).toBe('Community Requester (Anonymous)');

    // 2. Query as ADMIN -> citizen identity should be visible
    const adminRes = await request(app)
      .get(`/api/v1/requests/${ticketId}`)
      .set('x-user-role', 'ADMIN');

    expect(adminRes.status).toBe(200);
    expect(adminRes.body.requester.userId).toBe('citizen-jane-doe');
  });
});
