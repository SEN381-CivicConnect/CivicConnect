import { RequestStatus, VALID_FSM_TRANSITIONS } from '../enums/RequestStatus.js';
import { PriorityLevel } from '../enums/RoleAndPriority.js';
import { DomainEventDispatcher } from '../events/DomainEventDispatcher.js';
import {
  ServiceRequestCreatedEvent,
  ServiceRequestStatusChangedEvent,
  ServiceRequestAssignedEvent
} from '../events/ServiceRequestEvents.js';
import { v4 as uuidv4 } from 'uuid';

export interface ServiceRequestProps {
  requestId?: string;
  referenceNumber?: string;
  requesterId: string;
  departmentId: number;
  categoryId: number;
  categoryCode: string;
  priorityId: number;
  priorityCode: PriorityLevel;
  title: string;
  description: string;
  locationAddress: string;
  isAnonymizedDisplay?: boolean;
  assignedStaffId?: string | null;
  status?: RequestStatus;
  version?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export class InvalidStateTransitionError extends Error {
  constructor(from: RequestStatus, to: RequestStatus) {
    super(`Illegal status transition from ${from} to ${to}. Violates DEC-004 FSM rules.`);
    this.name = 'InvalidStateTransitionError';
  }
}

export class ConcurrencyConflictError extends Error {
  constructor(requestId: string, expectedVersion: number, actualVersion: number) {
    super(`Concurrency conflict on request ${requestId}. Expected version ${expectedVersion}, but found ${actualVersion}. (ADR-006 OCC).`);
    this.name = 'ConcurrencyConflictError';
  }
}

export class ServiceRequest {
  private readonly _requestId: string;
  private readonly _referenceNumber: string;
  private readonly _requesterId: string;
  private _departmentId: number;
  private readonly _categoryId: number;
  private readonly _categoryCode: string;
  private _priorityId: number;
  private _priorityCode: PriorityLevel;
  private _title: string;
  private _description: string;
  private _locationAddress: string;
  private _isAnonymizedDisplay: boolean;
  private _assignedStaffId: string | null;
  private _status: RequestStatus;
  private _version: number;
  private readonly _createdAt: Date;
  private _updatedAt: Date;

  constructor(props: ServiceRequestProps) {
    if (!props.title || props.title.trim().length === 0) {
      throw new Error('ServiceRequest title cannot be empty.');
    }
    if (!props.description || props.description.trim().length === 0) {
      throw new Error('ServiceRequest description cannot be empty.');
    }
    if (!props.locationAddress || props.locationAddress.trim().length === 0) {
      throw new Error('ServiceRequest locationAddress cannot be empty.');
    }

    this._requestId = props.requestId || uuidv4();
    this._referenceNumber = props.referenceNumber || ServiceRequest.generateReferenceNumber();
    this._requesterId = props.requesterId;
    this._departmentId = props.departmentId;
    this._categoryId = props.categoryId;
    this._categoryCode = props.categoryCode;
    this._priorityId = props.priorityId;
    this._priorityCode = props.priorityCode;
    this._title = props.title.trim();
    this._description = props.description.trim();
    this._locationAddress = props.locationAddress.trim();
    this._isAnonymizedDisplay = props.isAnonymizedDisplay ?? false;
    this._assignedStaffId = props.assignedStaffId ?? null;
    this._status = props.status || RequestStatus.SUBMITTED;
    this._version = props.version ?? 1;
    this._createdAt = props.createdAt || new Date();
    this._updatedAt = props.updatedAt || new Date();
  }

  // Getters
  public get requestId(): string { return this._requestId; }
  public get referenceNumber(): string { return this._referenceNumber; }
  public get requesterId(): string { return this._requesterId; }
  public get departmentId(): number { return this._departmentId; }
  public get categoryId(): number { return this._categoryId; }
  public get categoryCode(): string { return this._categoryCode; }
  public get priorityId(): number { return this._priorityId; }
  public get priorityCode(): PriorityLevel { return this._priorityCode; }
  public get title(): string { return this._title; }
  public get description(): string { return this._description; }
  public get locationAddress(): string { return this._locationAddress; }
  public get isAnonymizedDisplay(): boolean { return this._isAnonymizedDisplay; }
  public get assignedStaffId(): string | null { return this._assignedStaffId; }
  public get status(): RequestStatus { return this._status; }
  public get version(): number { return this._version; }
  public get createdAt(): Date { return this._createdAt; }
  public get updatedAt(): Date { return this._updatedAt; }

  /**
   * Helper to format reference tracking codes: REQ-YYYY-NNNN (e.g. REQ-2026-1042)
   */
  public static generateReferenceNumber(): string {
    const year = new Date().getFullYear();
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    return `REQ-${year}-${randomSuffix}`;
  }

  /**
   * Enforces the FSM status transition rules (DEC-004, FR-010) and increments
   * the OCC version counter (ADR-006). Emits a domain event (ADR-004).
   */
  public async transitionToStatus(
    newStatus: RequestStatus,
    actorId: string,
    actionNotes?: string,
    expectedVersion?: number
  ): Promise<void> {
    if (expectedVersion !== undefined && expectedVersion !== this._version) {
      throw new ConcurrencyConflictError(this._requestId, expectedVersion, this._version);
    }

    const allowableNextStates = VALID_FSM_TRANSITIONS[this._status];
    if (!allowableNextStates.includes(newStatus)) {
      throw new InvalidStateTransitionError(this._status, newStatus);
    }

    if ((newStatus === RequestStatus.RESOLVED || newStatus === RequestStatus.CLOSED) && (!actionNotes || actionNotes.trim().length === 0)) {
      throw new Error(`FR-011 Mandate: Action notes and resolution details must be provided before transitioning to ${newStatus}.`);
    }

    const previousStatus = this._status;
    this._status = newStatus;
    this._version += 1;
    this._updatedAt = new Date();

    // Dispatch Observer Domain Event (ADR-004)
    await DomainEventDispatcher.getInstance().dispatch(
      new ServiceRequestStatusChangedEvent(
        this._requestId,
        this._referenceNumber,
        actorId,
        previousStatus,
        newStatus,
        actionNotes
      )
    );
  }

  /**
   * Assigns ticket to field staff technician (FR-009) with OCC version protection.
   */
  public async assignTechnician(
    staffId: string,
    supervisorId: string,
    expectedVersion?: number
  ): Promise<void> {
    if (expectedVersion !== undefined && expectedVersion !== this._version) {
      throw new ConcurrencyConflictError(this._requestId, expectedVersion, this._version);
    }

    this._assignedStaffId = staffId;
    if (this._status === RequestStatus.SUBMITTED || this._status === RequestStatus.TRIAGED) {
      this._status = RequestStatus.ASSIGNED;
    }
    this._version += 1;
    this._updatedAt = new Date();

    // Dispatch Observer Domain Event (ADR-004)
    await DomainEventDispatcher.getInstance().dispatch(
      new ServiceRequestAssignedEvent(
        this._requestId,
        this._referenceNumber,
        staffId,
        supervisorId
      )
    );
  }
}
