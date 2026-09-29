import { IServiceRequestRepository, RequestFilterCriteria } from '../../domain/repositories/IServiceRequestRepository.js';
import { ServiceRequest, ConcurrencyConflictError } from '../../domain/entities/ServiceRequest.js';

export class InMemoryServiceRequestRepository implements IServiceRequestRepository {
  private storage: Map<string, ServiceRequest> = new Map();

  public async save(request: ServiceRequest): Promise<void> {
    this.storage.set(request.requestId, request);
  }

  public async update(request: ServiceRequest, _expectedVersion?: number): Promise<void> {
    const existing = this.storage.get(request.requestId);
    if (!existing) {
      throw new Error(`Service request ${request.requestId} not found.`);
    }

    this.storage.set(request.requestId, request);
  }

  public async findById(requestId: string): Promise<ServiceRequest | null> {
    const req = this.storage.get(requestId);
    return req || null;
  }

  public async findByReferenceNumber(referenceNumber: string): Promise<ServiceRequest | null> {
    for (const req of this.storage.values()) {
      if (req.referenceNumber === referenceNumber) {
        return req;
      }
    }
    return null;
  }

  public async findMany(criteria: RequestFilterCriteria): Promise<{ requests: ServiceRequest[]; totalCount: number }> {
    let results = Array.from(this.storage.values());

    if (criteria.status) {
      results = results.filter((r) => r.status === criteria.status);
    }
    if (criteria.departmentId) {
      results = results.filter((r) => r.departmentId === criteria.departmentId);
    }
    if (criteria.requesterId) {
      results = results.filter((r) => r.requesterId === criteria.requesterId);
    }
    if (criteria.assignedStaffId) {
      results = results.filter((r) => r.assignedStaffId === criteria.assignedStaffId);
    }

    const totalCount = results.length;
    const page = criteria.page || 1;
    const limit = criteria.limit || 20;
    const start = (page - 1) * limit;
    const paginated = results.slice(start, start + limit);

    return { requests: paginated, totalCount };
  }

  public clear(): void {
    this.storage.clear();
  }
}
