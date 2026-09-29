import { ServiceRequest } from '../entities/ServiceRequest.js';

export interface CreateServiceRequestDTO {
  requesterId: string;
  categoryCode: string;
  title: string;
  description: string;
  locationAddress: string;
  isAnonymizedDisplay?: boolean;
  metadata?: Record<string, any>;
}

/**
 * CivicConnect: Abstract Factory Creator Interface (GoF Factory Method)
 * Standard: ADR-005 & PED v2.0 Section 10
 */
export interface IServiceRequestFactory {
  readonly supportedCategoryCode: string;
  create(dto: CreateServiceRequestDTO): ServiceRequest;
}
