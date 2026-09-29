import { describe, it, expect } from 'vitest';
import { ServiceRequest } from '../../../src/domain/entities/ServiceRequest.js';
import { PriorityLevel, Role } from '../../../src/domain/enums/RoleAndPriority.js';
import { ServiceRequestDTOMapper } from '../../../src/application/dtos/ServiceRequestDTO.js';

describe('POPIA Anonymization Masking (NFR-005, FR-008)', () => {
  const anonymizedRequest = new ServiceRequest({
    requesterId: 'citizen-secret-uuid',
    departmentId: 3,
    categoryId: 4,
    categoryCode: 'SECURITY_HAZARD',
    priorityId: 4,
    priorityCode: PriorityLevel.CRITICAL,
    title: 'Suspicious individual loitering',
    description: 'Unknown person attempting to open parked vehicle doors',
    locationAddress: 'Student Parking Lot B',
    isAnonymizedDisplay: true
  });

  it('should mask citizen personal contact details when viewed by operational STAFF', () => {
    const dto = ServiceRequestDTOMapper.toDTO(anonymizedRequest, Role.STAFF, 'John Doe');

    expect(dto.requester.userId).toBe('[POPIA PROTECTED]');
    expect(dto.requester.displayName).toBe('Community Requester (Anonymous)');
    expect(dto.requester.isAnonymized).toBe(true);
  });

  it('should reveal full requester details when viewed by ADMIN or REQUESTER owner', () => {
    const dto = ServiceRequestDTOMapper.toDTO(anonymizedRequest, Role.ADMIN, 'John Doe');

    expect(dto.requester.userId).toBe('citizen-secret-uuid');
    expect(dto.requester.displayName).toBe('John Doe');
  });
});
