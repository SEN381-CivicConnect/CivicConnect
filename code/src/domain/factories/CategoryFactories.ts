import { IServiceRequestFactory, CreateServiceRequestDTO } from './IServiceRequestFactory.js';
import { ServiceRequest } from '../entities/ServiceRequest.js';
import { PriorityLevel } from '../enums/RoleAndPriority.js';

/**
 * Concrete Creator for Facilities & Campus Infrastructure faults.
 * Standard: ADR-005, FR-001, FR-002
 * Department: FAC (ID 1) | Default Priority: HIGH (ID 3)
 */
export class FacilitiesRequestFactory implements IServiceRequestFactory {
  public readonly supportedCategoryCode = 'FAC_FAULT';

  public create(dto: CreateServiceRequestDTO): ServiceRequest {
    if (!dto.locationAddress.includes('Building') && !dto.locationAddress.includes('Room') && !dto.locationAddress.includes('Campus')) {
      throw new Error("Validation Failure (FAC_FAULT): Location address must specify a Building or Room identifier.");
    }

    return new ServiceRequest({
      requesterId: dto.requesterId,
      departmentId: 1, // FAC
      categoryId: 1,
      categoryCode: this.supportedCategoryCode,
      priorityId: 3, // HIGH
      priorityCode: PriorityLevel.HIGH,
      title: dto.title,
      description: dto.description,
      locationAddress: dto.locationAddress,
      isAnonymizedDisplay: dto.isAnonymizedDisplay ?? false
    });
  }
}

/**
 * Concrete Creator for IT Support & Computer Lab requests.
 * Standard: ADR-005, FR-001, FR-002
 * Department: IT (ID 2) | Default Priority: MEDIUM (ID 2)
 */
export class ITSupportRequestFactory implements IServiceRequestFactory {
  public readonly supportedCategoryCode = 'IT_SUPPORT';

  public create(dto: CreateServiceRequestDTO): ServiceRequest {
    if (dto.description.length < 10) {
      throw new Error("Validation Failure (IT_SUPPORT): Description must specify device or connectivity details (min 10 chars).");
    }

    return new ServiceRequest({
      requesterId: dto.requesterId,
      departmentId: 2, // IT
      categoryId: 2,
      categoryCode: this.supportedCategoryCode,
      priorityId: 2, // MEDIUM
      priorityCode: PriorityLevel.MEDIUM,
      title: dto.title,
      description: dto.description,
      locationAddress: dto.locationAddress,
      isAnonymizedDisplay: dto.isAnonymizedDisplay ?? false
    });
  }
}

/**
 * Concrete Creator for Campus Security & Safety Hazards.
 * Standard: ADR-005, FR-001, FR-002
 * Department: SEC (ID 3) | Default Priority: CRITICAL (ID 4)
 */
export class SecurityHazardRequestFactory implements IServiceRequestFactory {
  public readonly supportedCategoryCode = 'SECURITY_HAZARD';

  public create(dto: CreateServiceRequestDTO): ServiceRequest {
    return new ServiceRequest({
      requesterId: dto.requesterId,
      departmentId: 3, // SEC
      categoryId: 4,
      categoryCode: this.supportedCategoryCode,
      priorityId: 4, // CRITICAL (Immediate 1h SLA triage)
      priorityCode: PriorityLevel.CRITICAL,
      title: `[EMERGENCY] ${dto.title}`,
      description: dto.description,
      locationAddress: dto.locationAddress,
      isAnonymizedDisplay: dto.isAnonymizedDisplay ?? true // Defaults to POPIA protection
    });
  }
}

/**
 * Concrete Creator for General Maintenance & Sanitation requests.
 * Department: MAINT (ID 4) | Default Priority: LOW (ID 1)
 */
export class GeneralMaintenanceRequestFactory implements IServiceRequestFactory {
  public readonly supportedCategoryCode = 'GENERAL_MAINT';

  public create(dto: CreateServiceRequestDTO): ServiceRequest {
    return new ServiceRequest({
      requesterId: dto.requesterId,
      departmentId: 4, // MAINT
      categoryId: 5,
      categoryCode: this.supportedCategoryCode,
      priorityId: 1, // LOW
      priorityCode: PriorityLevel.LOW,
      title: dto.title,
      description: dto.description,
      locationAddress: dto.locationAddress,
      isAnonymizedDisplay: dto.isAnonymizedDisplay ?? false
    });
  }
}

/**
 * Concrete Creator for Lost Property reports.
 * Department: SEC (ID 3) | Default Priority: LOW (ID 1)
 */
export class LostPropertyRequestFactory implements IServiceRequestFactory {
  public readonly supportedCategoryCode = 'LOST_PROPERTY';

  public create(dto: CreateServiceRequestDTO): ServiceRequest {
    return new ServiceRequest({
      requesterId: dto.requesterId,
      departmentId: 3, // SEC Custodial
      categoryId: 6,
      categoryCode: this.supportedCategoryCode,
      priorityId: 1, // LOW
      priorityCode: PriorityLevel.LOW,
      title: `[LOST PROPERTY] ${dto.title}`,
      description: dto.description,
      locationAddress: dto.locationAddress,
      isAnonymizedDisplay: dto.isAnonymizedDisplay ?? false
    });
  }
}

/**
 * ServiceRequestFactoryRegistry: Factory resolver implementing Open/Closed Principle.
 * New categories are registered dynamically without modifying intake route handlers.
 */
export class ServiceRequestFactoryRegistry {
  private static instance: ServiceRequestFactoryRegistry;
  private factories: Map<string, IServiceRequestFactory> = new Map();

  private constructor() {
    const fac = new FacilitiesRequestFactory();
    const it = new ITSupportRequestFactory();
    const sec = new SecurityHazardRequestFactory();
    const gm = new GeneralMaintenanceRequestFactory();
    const lp = new LostPropertyRequestFactory();

    this.registerFactory(fac);
    this.registerFactory(it);
    this.registerFactory(sec);
    this.registerFactory(gm);
    this.factories.set('GEN_MAINT', gm);
    this.registerFactory(lp);
    this.factories.set('LOST_PROP', lp);
  }

  public static getInstance(): ServiceRequestFactoryRegistry {
    if (!ServiceRequestFactoryRegistry.instance) {
      ServiceRequestFactoryRegistry.instance = new ServiceRequestFactoryRegistry();
    }
    return ServiceRequestFactoryRegistry.instance;
  }

  public registerFactory(factory: IServiceRequestFactory): void {
    this.factories.set(factory.supportedCategoryCode.toUpperCase(), factory);
  }

  public getFactory(categoryCode: string): IServiceRequestFactory {
    const factory = this.factories.get(categoryCode.toUpperCase());
    if (!factory) {
      throw new Error(`Unsupported service request category code: '${categoryCode}'. Valid categories: ${Array.from(this.factories.keys()).join(', ')}.`);
    }
    return factory;
  }
}
