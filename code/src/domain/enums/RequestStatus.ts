/**
 * CivicConnect: Service Request Lifecycle Statuses
 * Governing Standard: DEC-004 (State Machine Integrity) & PED v2.0 Section 5
 */
export enum RequestStatus {
  SUBMITTED = 'SUBMITTED',
  TRIAGED = 'TRIAGED',
  ASSIGNED = 'ASSIGNED',
  IN_PROGRESS = 'IN_PROGRESS',
  RESOLVED = 'RESOLVED',
  CLOSED = 'CLOSED',
  REJECTED = 'REJECTED'
}

/**
 * Valid FSM transition graph enforcing allowable state jumps.
 * Any jump outside this matrix violates DEC-004 and throws an InvalidStateTransitionError.
 */
export const VALID_FSM_TRANSITIONS: Record<RequestStatus, RequestStatus[]> = {
  [RequestStatus.SUBMITTED]: [RequestStatus.TRIAGED, RequestStatus.REJECTED],
  [RequestStatus.TRIAGED]: [RequestStatus.ASSIGNED, RequestStatus.REJECTED],
  [RequestStatus.ASSIGNED]: [RequestStatus.IN_PROGRESS, RequestStatus.TRIAGED],
  [RequestStatus.IN_PROGRESS]: [RequestStatus.RESOLVED, RequestStatus.ASSIGNED],
  [RequestStatus.RESOLVED]: [RequestStatus.CLOSED, RequestStatus.IN_PROGRESS],
  [RequestStatus.CLOSED]: [], // Terminal state
  [RequestStatus.REJECTED]: [] // Terminal state
};
