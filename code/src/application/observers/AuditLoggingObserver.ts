import { IDomainEventObserver } from '../../domain/events/IDomainEvent.js';
import { ServiceRequestStatusChangedEvent } from '../../domain/events/ServiceRequestEvents.js';

export interface AuditRecord {
  requestId: string;
  actorId: string;
  previousStatus: string;
  newStatus: string;
  actionNotes?: string;
  loggedAt: Date;
}

/**
 * Concrete Observer that captures immutable audit logs on all status transitions.
 * Standard: ADR-004, NFR-006, FR-011
 */
export class AuditLoggingObserver implements IDomainEventObserver<ServiceRequestStatusChangedEvent> {
  public auditRecords: AuditRecord[] = [];

  public async handle(event: ServiceRequestStatusChangedEvent): Promise<void> {
    this.auditRecords.push({
      requestId: event.requestId,
      actorId: event.actorId,
      previousStatus: event.previousStatus,
      newStatus: event.newStatus,
      actionNotes: event.actionNotes,
      loggedAt: event.occurredOn
    });
  }

  public clear(): void {
    this.auditRecords = [];
  }
}
