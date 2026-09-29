import { IDomainEvent } from './IDomainEvent.js';
import { RequestStatus } from '../enums/RequestStatus.js';
import { v4 as uuidv4 } from 'uuid';

/**
 * Event emitted when a new service request is successfully submitted.
 * Triggers citizen acknowledgment notification (FR-005) and triage routing.
 */
export class ServiceRequestCreatedEvent implements IDomainEvent {
  public readonly eventId: string = uuidv4();
  public readonly occurredOn: Date = new Date();
  public readonly eventName: string = 'ServiceRequestCreated';

  constructor(
    public readonly requestId: string,
    public readonly referenceNumber: string,
    public readonly requesterId: string,
    public readonly categoryCode: string,
    public readonly priorityCode: string
  ) {}
}

/**
 * Event emitted when a service request undergoes a validated FSM state transition.
 * Triggers citizen update notifications (FR-005) and immutable audit logging (NFR-006).
 */
export class ServiceRequestStatusChangedEvent implements IDomainEvent {
  public readonly eventId: string = uuidv4();
  public readonly occurredOn: Date = new Date();
  public readonly eventName: string = 'ServiceRequestStatusChanged';

  constructor(
    public readonly requestId: string,
    public readonly referenceNumber: string,
    public readonly actorId: string,
    public readonly previousStatus: RequestStatus,
    public readonly newStatus: RequestStatus,
    public readonly actionNotes?: string
  ) {}
}

/**
 * Event emitted when a ticket is assigned to an operational field technician.
 * Triggers technician queue alert (FR-006, FR-009).
 */
export class ServiceRequestAssignedEvent implements IDomainEvent {
  public readonly eventId: string = uuidv4();
  public readonly occurredOn: Date = new Date();
  public readonly eventName: string = 'ServiceRequestAssigned';

  constructor(
    public readonly requestId: string,
    public readonly referenceNumber: string,
    public readonly assignedStaffId: string,
    public readonly assignedBySupervisorId: string
  ) {}
}
