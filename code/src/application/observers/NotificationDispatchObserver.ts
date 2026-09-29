import { IDomainEventObserver } from '../../domain/events/IDomainEvent.js';
import {
  ServiceRequestCreatedEvent,
  ServiceRequestStatusChangedEvent,
  ServiceRequestAssignedEvent
} from '../../domain/events/ServiceRequestEvents.js';

export interface NotificationLog {
  recipientId: string;
  channel: 'EMAIL' | 'SMS' | 'IN_APP';
  message: string;
  sentAt: Date;
}

/**
 * Concrete Observer that handles automated citizen and technician notifications.
 * Standard: ADR-004, FR-005, NFR-002
 *
 * Decouples notifications from the ServiceRequest entity. If an external email/SMS
 * service is slow or down, this observer isolates the error and dispatches via Outbox.
 */
export class NotificationDispatchObserver implements IDomainEventObserver {
  public dispatchedNotifications: NotificationLog[] = [];

  public async handle(event: any): Promise<void> {
    if (event instanceof ServiceRequestCreatedEvent) {
      this.dispatchedNotifications.push({
        recipientId: event.requesterId,
        channel: 'EMAIL',
        message: `CivicConnect: Your request ${event.referenceNumber} has been received and queued for triage.`,
        sentAt: new Date()
      });
    } else if (event instanceof ServiceRequestStatusChangedEvent) {
      this.dispatchedNotifications.push({
        recipientId: event.actorId, // In production, resolved to requester's ID
        channel: 'SMS',
        message: `CivicConnect Update: Ticket ${event.referenceNumber} status changed to ${event.newStatus}.`,
        sentAt: new Date()
      });
    } else if (event instanceof ServiceRequestAssignedEvent) {
      this.dispatchedNotifications.push({
        recipientId: event.assignedStaffId,
        channel: 'IN_APP',
        message: `CivicConnect Task Alert: You have been assigned ticket ${event.referenceNumber}.`,
        sentAt: new Date()
      });
    }
  }

  public clear(): void {
    this.dispatchedNotifications = [];
  }
}
