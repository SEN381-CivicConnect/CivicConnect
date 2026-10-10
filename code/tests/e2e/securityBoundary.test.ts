import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { createApp } from '../../src/app.js';
import { InMemoryServiceRequestRepository } from '../../src/infrastructure/repositories/InMemoryServiceRequestRepository.js';
import { DomainEventDispatcher } from '../../src/domain/events/DomainEventDispatcher.js';
import { RequestStatus } from '../../src/domain/enums/RequestStatus.js';

/**
 * End-to-End (E2E) System Test Suite: Security, RBAC & State Invariant Boundary
 * Governing Standards: SEN381 Milestone 3 Brief §3, §9 & §10; Master Project Brief §16 (Security)
 * Test Case ID: TC-E2E-SEC-01
 * Traced Requirements: FR-010, FR-011, NFR-004 (RBAC Security), NFR-009 (Concurrency & State Invariants)
 */
describe('E2E User Journey: Security, RBAC & State Invariant Boundary (TC-E2E-SEC-01)', () => {
  let repository: InMemoryServiceRequestRepository;
  let app: any;

  beforeEach(() => {
    DomainEventDispatcher.getInstance().clearObservers();
    repository = new InMemoryServiceRequestRepository();
    app = createApp(repository);
  });

  it('enforces system-wide security, authorization guards, FSM invariants, and optimistic concurrency tamper-resistance', async () => {
    // -------------------------------------------------------------------------
    // Step 1: Baseline Ticket Creation (Citizen submits Security Hazard ticket)
    // -------------------------------------------------------------------------
    const baselineRes = await request(app)
      .post('/api/v1/requests')
      .set('x-user-role', 'REQUESTER')
      .set('x-user-id', 'citizen-alice-01')
      .send({
        categoryCode: 'SECURITY_HAZARD',
        title: 'Broken security gate sensor at North Gate',
        description: 'Perimeter sliding gate fails to close automatically after vehicles enter',
        locationAddress: 'North Gate, Security Checkpoint 1',
        isAnonymizedDisplay: true
      });

    expect(baselineRes.status).toBe(201);
    const ticketId = baselineRes.body.requestId;
    expect(baselineRes.body.status).toBe(RequestStatus.SUBMITTED);
    expect(baselineRes.body.version).toBe(1);

    // -------------------------------------------------------------------------
    // Step 2: Privilege Escalation Rejection - Citizen attempts technician assignment (NFR-004)
    // -------------------------------------------------------------------------
    const unauthorizedAssignRes = await request(app)
      .patch(`/api/v1/requests/${ticketId}/assign`)
      .set('x-user-role', 'REQUESTER')
      .set('x-user-id', 'citizen-alice-01')
      .send({
        staffId: 'staff-rogue-01',
        expectedVersion: 1
      });

    expect(unauthorizedAssignRes.status).toBe(403);
    expect(unauthorizedAssignRes.body).toHaveProperty('error');
    expect(unauthorizedAssignRes.body.error).toContain('Forbidden');

    // -------------------------------------------------------------------------
    // Step 3: Privilege Escalation Rejection - Citizen attempts status transition (NFR-004)
    // -------------------------------------------------------------------------
    const unauthorizedStatusRes = await request(app)
      .patch(`/api/v1/requests/${ticketId}/status`)
      .set('x-user-role', 'REQUESTER')
      .set('x-user-id', 'citizen-alice-01')
      .send({
        newStatus: RequestStatus.RESOLVED,
        actionNotes: 'Citizen trying to self-resolve ticket',
        expectedVersion: 1
      });

    expect(unauthorizedStatusRes.status).toBe(403);
    expect(unauthorizedStatusRes.body.error).toContain('Forbidden');

    // -------------------------------------------------------------------------
    // Step 4: FSM Invariant Protection - Illegal Lifecycle State Skip (FR-010, DEC-004)
    // Staff attempts to jump SUBMITTED directly to RESOLVED without triage or assignment
    // -------------------------------------------------------------------------
    const illegalJumpRes = await request(app)
      .patch(`/api/v1/requests/${ticketId}/status`)
      .set('x-user-role', 'STAFF')
      .set('x-user-id', 'staff-security-01')
      .send({
        newStatus: RequestStatus.RESOLVED,
        actionNotes: 'Attempting to resolve unassigned ticket directly',
        expectedVersion: 1
      });

    expect(illegalJumpRes.status).toBe(400);
    expect(illegalJumpRes.body.error).toContain('Illegal status transition');

    // -------------------------------------------------------------------------
    // Step 5: FR-011 Mandate - Missing Resolution Details Rejection (FR-011)
    // Legitimate supervisor assigns technician, moving to ASSIGNED (version 2)
    // -------------------------------------------------------------------------
    const validAssignRes = await request(app)
      .patch(`/api/v1/requests/${ticketId}/assign`)
      .set('x-user-role', 'STAFF')
      .set('x-user-id', 'sup-commander-01')
      .send({
        staffId: 'staff-security-01',
        expectedVersion: 1
      });

    expect(validAssignRes.status).toBe(200);
    expect(validAssignRes.body.status).toBe(RequestStatus.ASSIGNED);
    expect(validAssignRes.body.version).toBe(2);

    // Technician moves ticket to IN_PROGRESS (version 3)
    const validProgressRes = await request(app)
      .patch(`/api/v1/requests/${ticketId}/status`)
      .set('x-user-role', 'STAFF')
      .set('x-user-id', 'staff-security-01')
      .send({
        newStatus: RequestStatus.IN_PROGRESS,
        actionNotes: 'Technician on-site evaluating sensor optics',
        expectedVersion: 2
      });

    expect(validProgressRes.status).toBe(200);
    expect(validProgressRes.body.status).toBe(RequestStatus.IN_PROGRESS);
    expect(validProgressRes.body.version).toBe(3);

    // Technician attempts to resolve WITHOUT resolution action notes (FR-011 violation)
    const emptyNotesResolveRes = await request(app)
      .patch(`/api/v1/requests/${ticketId}/status`)
      .set('x-user-role', 'STAFF')
      .set('x-user-id', 'staff-security-01')
      .send({
        newStatus: RequestStatus.RESOLVED,
        actionNotes: '   ', // Blank whitespace notes
        expectedVersion: 3
      });

    expect(emptyNotesResolveRes.status).toBe(400);
    expect(emptyNotesResolveRes.body.error).toContain('FR-011 Mandate');

    // -------------------------------------------------------------------------
    // Step 6: Optimistic Concurrency Control Tamper Resistance (ADR-006, NFR-009)
    // Stale version collision attempt using expectedVersion: 1 on a version 3 record
    // -------------------------------------------------------------------------
    const staleVersionRes = await request(app)
      .patch(`/api/v1/requests/${ticketId}/status`)
      .set('x-user-role', 'STAFF')
      .set('x-user-id', 'staff-security-01')
      .send({
        newStatus: RequestStatus.RESOLVED,
        actionNotes: 'Replaced optical sensor and aligned laser beam',
        expectedVersion: 1 // Stale! Current is 3
      });

    expect(staleVersionRes.status).toBe(409);
    expect(staleVersionRes.body.error).toContain('Concurrency conflict');

    // -------------------------------------------------------------------------
    // Step 7: Verifying Database State Invariant Integrity
    // Record in database must remain at IN_PROGRESS with version: 3, completely uncorrupted
    // -------------------------------------------------------------------------
    const finalAuditRes = await request(app)
      .get(`/api/v1/requests/${ticketId}`)
      .set('x-user-role', 'STAFF');

    expect(finalAuditRes.status).toBe(200);
    expect(finalAuditRes.body.status).toBe(RequestStatus.IN_PROGRESS);
    expect(finalAuditRes.body.version).toBe(3);
    expect(finalAuditRes.body.assignedStaffId).toBe('staff-security-01');
  });
});
