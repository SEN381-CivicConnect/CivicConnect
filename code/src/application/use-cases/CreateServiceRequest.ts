import { IServiceRequestRepository } from '../../domain/repositories/IServiceRequestRepository.js';
import { ServiceRequestFactoryRegistry } from '../../domain/factories/CategoryFactories.js';
import { CreateServiceRequestDTO } from '../../domain/factories/IServiceRequestFactory.js';
import { ServiceRequest } from '../../domain/entities/ServiceRequest.js';
import { DomainEventDispatcher } from '../../domain/events/DomainEventDispatcher.js';
import { ServiceRequestCreatedEvent } from '../../domain/events/ServiceRequestEvents.js';

export class CreateServiceRequestUseCase {
  constructor(
    private readonly requestRepository: IServiceRequestRepository,
    private readonly factoryRegistry: ServiceRequestFactoryRegistry = ServiceRequestFactoryRegistry.getInstance()
  ) {}

  public async execute(dto: CreateServiceRequestDTO): Promise<ServiceRequest> {
    // 1. Resolve specialized category factory (Factory Method Pattern - ADR-005)
    const factory = this.factoryRegistry.getFactory(dto.categoryCode);

    // 2. Instantiate and validate domain entity
    const newRequest = factory.create(dto);

    // 3. Persist to repository
    await this.requestRepository.save(newRequest);

    // 4. Dispatch Domain Event to notify Observers (ADR-004)
    await DomainEventDispatcher.getInstance().dispatch(
      new ServiceRequestCreatedEvent(
        newRequest.requestId,
        newRequest.referenceNumber,
        newRequest.requesterId,
        newRequest.categoryCode,
        newRequest.priorityCode
      )
    );

    return newRequest;
  }
}
