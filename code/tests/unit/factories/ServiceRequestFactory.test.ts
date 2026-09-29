import { describe, it, expect } from 'vitest';
import { ServiceRequestFactoryRegistry } from '../../../src/domain/factories/CategoryFactories.js';
import { PriorityLevel } from '../../../src/domain/enums/RoleAndPriority.js';

describe('Factory Method Pattern for Polymorphic Intake (ADR-005, FR-001, FR-002)', () => {
  const registry = ServiceRequestFactoryRegistry.getInstance();

  it('should instantiate FacilitiesRequestFactory and assign default priority HIGH', () => {
    const factory = registry.getFactory('FAC_FAULT');
    const request = factory.create({
      requesterId: 'citizen-101',
      categoryCode: 'FAC_FAULT',
      title: 'Broken window in Room 204',
      description: 'Cracked glass from storm winds',
      locationAddress: 'Building A, Room 204'
    });

    expect(request.categoryCode).toBe('FAC_FAULT');
    expect(request.departmentId).toBe(1); // Facilities
    expect(request.priorityCode).toBe(PriorityLevel.HIGH);
    expect(request.title).toBe('Broken window in Room 204');
  });

  it('should fail validation when Facilities request lacks Building or Room info', () => {
    const factory = registry.getFactory('FAC_FAULT');
    expect(() => {
      factory.create({
        requesterId: 'citizen-101',
        categoryCode: 'FAC_FAULT',
        title: 'Broken faucet',
        description: 'Water dripping continuously',
        locationAddress: 'Outside sidewalk'
      });
    }).toThrow(/Validation Failure \(FAC_FAULT\): Location address must specify a Building or Room identifier/);
  });

  it('should instantiate SecurityHazardRequestFactory with priority CRITICAL and emergency prefix', () => {
    const factory = registry.getFactory('SECURITY_HAZARD');
    const request = factory.create({
      requesterId: 'citizen-102',
      categoryCode: 'SECURITY_HAZARD',
      title: 'Perimeter fence breach',
      description: 'Cut wire observed on east perimeter fence',
      locationAddress: 'East Perimeter Gate 3'
    });

    expect(request.categoryCode).toBe('SECURITY_HAZARD');
    expect(request.departmentId).toBe(3); // Security
    expect(request.priorityCode).toBe(PriorityLevel.CRITICAL);
    expect(request.title).toBe('[EMERGENCY] Perimeter fence breach');
    expect(request.isAnonymizedDisplay).toBe(true); // Defaults to POPIA protection
  });

  it('should throw descriptive error when unsupported category is requested', () => {
    expect(() => {
      registry.getFactory('NON_EXISTENT_CATEGORY');
    }).toThrow(/Unsupported service request category code: 'NON_EXISTENT_CATEGORY'/);
  });
});
