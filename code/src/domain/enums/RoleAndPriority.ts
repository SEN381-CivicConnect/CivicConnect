/**
 * CivicConnect: System Authorization Roles (RBAC)
 * Governing Standard: NFR-004 & PED v2.0 Section 6
 */
export enum Role {
  REQUESTER = 'REQUESTER',
  STAFF = 'STAFF',
  SUPERVISOR = 'SUPERVISOR',
  ADMIN = 'ADMIN'
}

/**
 * Priority Levels and configured SLA turnaround thresholds (hours)
 * Governing Standard: FR-001, FR-013 & PED v2.0 Section 5
 */
export enum PriorityLevel {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

export interface SlaThreshold {
  triageHours: number;
  resolutionHours: number;
}

export const SLA_TARGETS: Record<PriorityLevel, SlaThreshold> = {
  [PriorityLevel.LOW]: { triageHours: 48, resolutionHours: 120 },
  [PriorityLevel.MEDIUM]: { triageHours: 24, resolutionHours: 72 },
  [PriorityLevel.HIGH]: { triageHours: 4, resolutionHours: 24 },
  [PriorityLevel.CRITICAL]: { triageHours: 1, resolutionHours: 8 }
};
