import { IServiceRequestRepository } from '../../domain/repositories/IServiceRequestRepository.js';
import { ServiceRequest, ConcurrencyConflictError } from '../../domain/entities/ServiceRequest.js';

export interface AssignRequestCommand {
  requestId: string;
  staffId: string;
  supervisorId: string;
  expectedVersion?: number;
}

export class AssignServiceRequestUseCase {
  constructor(private readonly requestRepository: IServiceRequestRepository) {}

  public async execute(command: AssignRequestCommand): Promise<ServiceRequest> {
    const request = await this.requestRepository.findById(command.requestId);
    if (!request) {
      throw new Error(`Service request ${command.requestId} not found.`);
    }

    // Assign technician with Optimistic Concurrency Control check (ADR-006)
    await request.assignTechnician(command.staffId, command.supervisorId, command.expectedVersion);

    // Update in repository with expected version check
    await this.requestRepository.update(request, command.expectedVersion);

    return request;
  }
}
