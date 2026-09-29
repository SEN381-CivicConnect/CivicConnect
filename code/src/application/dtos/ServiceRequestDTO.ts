import { ServiceRequest } from '../../domain/entities/ServiceRequest.js';
import { Role } from '../../domain/enums/RoleAndPriority.js';

export interface ServiceRequestResponseDTO {
  requestId: string;
  referenceNumber: string;
  requester: {
    userId: string;
    displayName: string;
    isAnonymized: boolean;
  };
  departmentId: number;
  categoryCode: string;
  priorityCode: string;
  title: string;
  description: string;
  locationAddress: string;
  assignedStaffId: string | null;
  status: string;
  version: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * ServiceRequestDTOMapper: Formats responses and enforces POPIA privacy masking (NFR-005)
 * If isAnonymizedDisplay is true and the viewing role is STAFF/TECHNICIAN,
 * citizen identifiers are masked to prevent personal data exposure.
 */
export class ServiceRequestDTOMapper {
  public static toDTO(
    request: ServiceRequest,
    viewerRole: Role = Role.REQUESTER,
    requesterName: string = 'Dr. S. Khumalo'
  ): ServiceRequestResponseDTO {
    const isMasked = request.isAnonymizedDisplay && viewerRole === Role.STAFF;

    return {
      requestId: request.requestId,
      referenceNumber: request.referenceNumber,
      requester: {
        userId: isMasked ? '[POPIA PROTECTED]' : request.requesterId,
        displayName: isMasked ? 'Community Requester (Anonymous)' : requesterName,
        isAnonymized: request.isAnonymizedDisplay
      },
      departmentId: request.departmentId,
      categoryCode: request.categoryCode,
      priorityCode: request.priorityCode,
      title: request.title,
      description: request.description,
      locationAddress: request.locationAddress,
      assignedStaffId: request.assignedStaffId,
      status: request.status,
      version: request.version,
      createdAt: request.createdAt.toISOString(),
      updatedAt: request.updatedAt.toISOString()
    };
  }
}
