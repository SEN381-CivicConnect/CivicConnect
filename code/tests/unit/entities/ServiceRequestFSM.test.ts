import { describe, it, expect, beforeEach } from 'vitest';
import { ServiceRequest, InvalidStateTransitionError } from '../../../src/domain/entities/ServiceRequest.js';
import { RequestStatus } from '../../../src/domain/enums/RequestStatus.js';
import { PriorityLevel } from '../../../src/domain/enums/RoleAndPriority.js';
import { DomainEventDispatcher } from '../../../src/domain/events/DomainEventDispatcher.js';

describe('ServiceRequest Finite State Machine (DEC-004, FR-010)', () => {
  beforeEach(() => {
    DomainEventDispatcher.getInstance().clearObservers();
  });

  const createValidRequest = () => {
    return new ServiceRequest({
      requesterId: 'user-citizen-001',
      departmentId: 1,
      categoryId: 1,
      categoryCode: 'FAC_FAULT',
      priorityId: 3,
      priorityCode: PriorityLevel.HIGH,
      title: 'Water pipe leak in Building 4',
      description: 'Major leak flooding corridor floor',
      locationAddress: 'Building 4, Floor 1, North Corridor'
    });
  };

  it('should initialize with status SUBMITTED and version 1', () => {
    const req = createValidRequest();
    expect(req.status).toBe(RequestStatus.SUBMITTED);
    expect(req.version).toBe(1);
    expect(req.referenceNumber).toMatch(/^REQ-\d{4}-\d{4}$/);
  });

  it('should allow valid transitions: SUBMITTED -> TRIAGED -> ASSIGNED -> IN_PROGRESS -> RESOLVED -> CLOSED', async () => {
    const req = createValidRequest();

    await req.transitionToStatus(RequestStatus.TRIAGED, 'supervisor-001');
    expect(req.status).toBe(RequestStatus.TRIAGED);
    expect(req.version).toBe(2);

    await req.assignTechnician('staff-tech-001', 'supervisor-001');
    expect(req.status).toBe(RequestStatus.ASSIGNED);
    expect(req.version).toBe(3);

    await req.transitionToStatus(RequestStatus.IN_PROGRESS, 'staff-tech-001');
    expect(req.status).toBe(RequestStatus.IN_PROGRESS);
    expect(req.version).toBe(4);

    await req.transitionToStatus(RequestStatus.RESOLVED, 'staff-tech-001', 'Replaced faulty valve pipe.');
    expect(req.status).toBe(RequestStatus.RESOLVED);
    expect(req.version).toBe(5);

    await req.transitionToStatus(RequestStatus.CLOSED, 'supervisor-001', 'Citizen confirmed resolution.');
    expect(req.status).toBe(RequestStatus.CLOSED);
    expect(req.version).toBe(6);
  });

  it('should reject invalid state jumps (e.g. SUBMITTED directly to RESOLVED) with InvalidStateTransitionError', async () => {
    const req = createValidRequest();

    await expect(
      req.transitionToStatus(RequestStatus.RESOLVED, 'actor-001', 'Attempted skip')
    ).rejects.toThrow(InvalidStateTransitionError);
  });

  it('should enforce FR-011 mandate: require action notes when transitioning to RESOLVED', async () => {
    const req = createValidRequest();
    await req.transitionToStatus(RequestStatus.TRIAGED, 'supervisor-001');
    await req.assignTechnician('staff-tech-001', 'supervisor-001');
    await req.transitionToStatus(RequestStatus.IN_PROGRESS, 'staff-tech-001');

    await expect(
      req.transitionToStatus(RequestStatus.RESOLVED, 'staff-tech-001', '')
    ).rejects.toThrow(/FR-011 Mandate: Action notes and resolution details must be provided/);
  });
});
