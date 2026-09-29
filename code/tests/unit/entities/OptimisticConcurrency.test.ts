import { describe, it, expect, beforeEach } from 'vitest';
import { ServiceRequest, ConcurrencyConflictError } from '../../../src/domain/entities/ServiceRequest.js';
import { RequestStatus } from '../../../src/domain/enums/RequestStatus.js';
import { PriorityLevel } from '../../../src/domain/enums/RoleAndPriority.js';
import { DomainEventDispatcher } from '../../../src/domain/events/DomainEventDispatcher.js';

describe('Optimistic Concurrency Control (ADR-006, NFR-009)', () => {
  beforeEach(() => {
    DomainEventDispatcher.getInstance().clearObservers();
  });

  const createRequest = () => {
    return new ServiceRequest({
      requesterId: 'user-001',
      departmentId: 2,
      categoryId: 2,
      categoryCode: 'IT_SUPPORT',
      priorityId: 2,
      priorityCode: PriorityLevel.MEDIUM,
      title: 'Lab 3 Wi-Fi router failure',
      description: 'Unable to access gateway in Lab 3',
      locationAddress: 'Campus Main Library, Lab 3'
    });
  };

  it('should accept update when expectedVersion matches current version', async () => {
    const req = createRequest();
    expect(req.version).toBe(1);

    await req.transitionToStatus(RequestStatus.TRIAGED, 'supervisor-001', undefined, 1);
    expect(req.version).toBe(2);
  });

  it('should throw ConcurrencyConflictError when expectedVersion does not match current version', async () => {
    const req = createRequest();
    expect(req.version).toBe(1);

    // Another actor updates the request first
    await req.transitionToStatus(RequestStatus.TRIAGED, 'supervisor-001');
    expect(req.version).toBe(2);

    // Stale actor attempts to assign with outdated expectedVersion: 1
    await expect(
      req.assignTechnician('tech-001', 'supervisor-002', 1)
    ).rejects.toThrow(ConcurrencyConflictError);
  });
});
