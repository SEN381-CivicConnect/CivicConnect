import { ServiceRequest } from '../entities/ServiceRequest.js';
import { RequestStatus } from '../enums/RequestStatus.js';

export interface RequestFilterCriteria {
  status?: RequestStatus;
  departmentId?: number;
  priorityId?: number;
  requesterId?: string;
  assignedStaffId?: string;
  page?: number;
  limit?: number;
}

export interface IServiceRequestRepository {
  save(request: ServiceRequest): Promise<void>;
  update(request: ServiceRequest, expectedVersion?: number): Promise<void>;
  findById(requestId: string): Promise<ServiceRequest | null>;
  findByReferenceNumber(referenceNumber: string): Promise<ServiceRequest | null>;
  findMany(criteria: RequestFilterCriteria): Promise<{ requests: ServiceRequest[]; totalCount: number }>;
}
