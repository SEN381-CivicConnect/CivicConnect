import { describe, it, expect, beforeEach } from 'vitest';
import { DomainEventDispatcher } from '../../../src/domain/events/DomainEventDispatcher.js';
import { NotificationDispatchObserver } from '../../../src/application/observers/NotificationDispatchObserver.js';
import { AuditLoggingObserver } from '../../../src/application/observers/AuditLoggingObserver.js';
import { ServiceRequest } from '../../../src/domain/entities/ServiceRequest.js';
import { RequestStatus } from '../../../src/domain/enums/RequestStatus.js';
import { PriorityLevel } from '../../../src/domain/enums/RoleAndPriority.js';

describe('Observer Pattern for Decoupled Notifications & Audit Logging (ADR-004, FR-005, NFR-006)', () => {
  let dispatcher: DomainEventDispatcher;
  let notificationObserver: NotificationDispatchObserver;
  let auditObserver: AuditLoggingObserver;

  beforeEach(() => {
    dispatcher = DomainEventDispatcher.getInstance();
    dispatcher.clearObservers();

    notificationObserver = new NotificationDispatchObserver();
    auditObserver = new AuditLoggingObserver();

    dispatcher.register('ServiceRequestStatusChanged', notificationObserver);
    dispatcher.register('ServiceRequestStatusChanged', auditObserver);
  });

  it('should automatically notify both Notification and Audit observers upon status transition', async () => {
    const request = new ServiceRequest({
      requesterId: 'user-citizen-99',
      departmentId: 1,
      categoryId: 1,
      categoryCode: 'FAC_FAULT',
      priorityId: 3,
      priorityCode: PriorityLevel.HIGH,
      title: 'Power outage in lab',
      description: 'Main circuit breaker tripped',
      locationAddress: 'Engineering Wing, Lab 1'
    });

    expect(notificationObserver.dispatchedNotifications).toHaveLength(0);
    expect(auditObserver.auditRecords).toHaveLength(0);

    // Transition status: triggers DomainEventDispatcher
    await request.transitionToStatus(RequestStatus.TRIAGED, 'supervisor-42');

    // Assert Notification Observer received event
    expect(notificationObserver.dispatchedNotifications).toHaveLength(1);
    expect(notificationObserver.dispatchedNotifications[0].message).toContain('status changed to TRIAGED');
    expect(notificationObserver.dispatchedNotifications[0].channel).toBe('SMS');

    // Assert Audit Logging Observer captured immutable record
    expect(auditObserver.auditRecords).toHaveLength(1);
    expect(auditObserver.auditRecords[0].previousStatus).toBe(RequestStatus.SUBMITTED);
    expect(auditObserver.auditRecords[0].newStatus).toBe(RequestStatus.TRIAGED);
    expect(auditObserver.auditRecords[0].actorId).toBe('supervisor-42');
  });
});
