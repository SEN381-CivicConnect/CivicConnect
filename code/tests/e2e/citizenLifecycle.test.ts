import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { createApp } from '../../src/app.js';
import { InMemoryServiceRequestRepository } from '../../src/infrastructure/repositories/InMemoryServiceRequestRepository.js';
import { DomainEventDispatcher } from '../../src/domain/events/DomainEventDispatcher.js';
import { RequestStatus } from '../../src/domain/enums/RequestStatus.js';

/**
 * End-to-End (E2E) System Test Suite: Multi-Step Lifecycle Journey
 * Governing Standards: SEN381 Milestone 3 Brief §3, §9 & §10; Master Project Brief §3 & §11
 * Test Case ID: TC-E2E-LIFE-01
 * Traced Requirements: FR-001, FR-003, FR-008, FR-009, FR-010, FR-011, NFR-005, NFR-006
 */
describe('E2E User Journey: Citizen-to-Resolution Multi-Step Lifecycle (TC-E2E-LIFE-01)', () => {
  let repository: InMemoryServiceRequestRepository;
  let app: any;

  beforeEach(() => {
    DomainEventDispatcher.getInstance().clearObservers();
    repository = new InMemoryServiceRequestRepository();
    app = createApp(repository);
  });

  it('executes full multi-step journey: citizen intake -> supervisor triage & assignment -> technician work -> resolution -> citizen audit verification', async () => {
    // -------------------------------------------------------------------------
    // Step 1: Citizen submits a Facility Fault service request (FR-001, FR-002)
    // -------------------------------------------------------------------------
    const intakePayload = {
      categoryCode: 'FAC_FAULT',
      title: 'Main Library Water Pipe Rupture',
      description: 'High-pressure clean water spraying across main walkway near Room 102',
      locationAddress: 'Building C, Room 102 (Walkway)',
      isAnonymizedDisplay: true
    };

    const intakeRes = await request(app)
      .post('/api/v1/requests')
      .set('x-user-role', 'REQUESTER')
      .set('x-user-id', 'cit-requester-991')
      .send(intakePayload);

    expect(intakeRes.status).toBe(201);
    expect(intakeRes.body).toHaveProperty('requestId');
    expect(intakeRes.body.referenceNumber).toMatch(/^REQ-\d{4}-\d{4}$/);
    expect(intakeRes.body.status).toBe(RequestStatus.SUBMITTED);
    expect(intakeRes.body.version).toBe(1);
    expect(intakeRes.body.categoryCode).toBe('FAC_FAULT');
    expect(intakeRes.body.assignedStaffId).toBeNull();

    const ticketId = intakeRes.body.requestId;

    // -------------------------------------------------------------------------
    // Step 2: Operational Supervisor views ticket and assigns field technician (FR-009, ADR-006)
    // -------------------------------------------------------------------------
    const assignRes = await request(app)
      .patch(`/api/v1/requests/${ticketId}/assign`)
      .set('x-user-role', 'STAFF')
      .set('x-user-id', 'sup-manager-001')
      .send({
        staffId: 'staff-plumber-042',
        expectedVersion: 1
      });

    expect(assignRes.status).toBe(200);
    expect(assignRes.body.status).toBe(RequestStatus.ASSIGNED);
    expect(assignRes.body.assignedStaffId).toBe('staff-plumber-042');
    expect(assignRes.body.version).toBe(2);

    // -------------------------------------------------------------------------
    // Step 3: Assigned technician accepts ticket and marks work IN_PROGRESS (FR-010)
    // -------------------------------------------------------------------------
    const progressRes = await request(app)
      .patch(`/api/v1/requests/${ticketId}/status`)
      .set('x-user-role', 'STAFF')
      .set('x-user-id', 'staff-plumber-042')
      .send({
        newStatus: RequestStatus.IN_PROGRESS,
        actionNotes: 'Field plumber arrived on-site and isolated leaking main control valve',
        expectedVersion: 2
      });

    expect(progressRes.status).toBe(200);
    expect(progressRes.body.status).toBe(RequestStatus.IN_PROGRESS);
    expect(progressRes.body.version).toBe(3);

    // -------------------------------------------------------------------------
    // Step 4: Technician completes repairs and marks ticket RESOLVED (FR-010, FR-011)
    // -------------------------------------------------------------------------
    const resolveRes = await request(app)
      .patch(`/api/v1/requests/${ticketId}/status`)
      .set('x-user-role', 'STAFF')
      .set('x-user-id', 'staff-plumber-042')
      .send({
        newStatus: RequestStatus.RESOLVED,
        actionNotes: 'Replaced 50mm damaged copper coupling and pressure tested line to 4 bar',
        expectedVersion: 3
      });

    expect(resolveRes.status).toBe(200);
    expect(resolveRes.body.status).toBe(RequestStatus.RESOLVED);
    expect(resolveRes.body.version).toBe(4);

    // -------------------------------------------------------------------------
    // Step 5: Staff inspects resolved ticket verifying resolution and POPIA privacy masking (FR-003, FR-008, NFR-005)
    // -------------------------------------------------------------------------
    const verifyRes = await request(app)
      .get(`/api/v1/requests/${ticketId}`)
      .set('x-user-role', 'STAFF')
      .set('x-user-id', 'staff-plumber-042');

    expect(verifyRes.status).toBe(200);
    expect(verifyRes.body.requestId).toBe(ticketId);
    expect(verifyRes.body.status).toBe(RequestStatus.RESOLVED);
    expect(verifyRes.body.assignedStaffId).toBe('staff-plumber-042');
    expect(verifyRes.body.version).toBe(4);
    // POPIA verification: Citizen requester identity is protected in staff view
    expect(verifyRes.body.requester.userId).toBe('[POPIA PROTECTED]');
    expect(verifyRes.body.requester.displayName).toBe('Community Requester (Anonymous)');
  });
});
