import { IServiceRequestRepository } from '../../domain/repositories/IServiceRequestRepository.js';
import { ServiceRequest } from '../../domain/entities/ServiceRequest.js';
import { RequestStatus } from '../../domain/enums/RequestStatus.js';

export interface UpdateStatusCommand {
  requestId: string;
  actorId: string;
  newStatus: RequestStatus;
  actionNotes?: string;
  expectedVersion?: number;
}

export class UpdateServiceRequestStatusUseCase {
  constructor(private readonly requestRepository: IServiceRequestRepository) {}

  public async execute(command: UpdateStatusCommand): Promise<ServiceRequest> {
    const request = await this.requestRepository.findById(command.requestId);
    if (!request) {
      throw new Error(`Service request ${command.requestId} not found.`);
    }

    // Enforce FSM state transitions (DEC-004) and OCC version check (ADR-006)
    await request.transitionToStatus(
      command.newStatus,
      command.actorId,
      command.actionNotes,
      command.expectedVersion
    );

    // Save changes
    await this.requestRepository.update(request, command.expectedVersion);

    return request;
  }
}
