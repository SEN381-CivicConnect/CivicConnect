import { Request, Response } from 'express';
import { CreateServiceRequestUseCase } from '../../application/use-cases/CreateServiceRequest.js';
import { AssignServiceRequestUseCase } from '../../application/use-cases/AssignServiceRequest.js';
import { UpdateServiceRequestStatusUseCase } from '../../application/use-cases/UpdateServiceRequestStatus.js';
import { IServiceRequestRepository } from '../../domain/repositories/IServiceRequestRepository.js';
import { ServiceRequestDTOMapper } from '../../application/dtos/ServiceRequestDTO.js';
import { Role } from '../../domain/enums/RoleAndPriority.js';
import { ConcurrencyConflictError } from '../../domain/entities/ServiceRequest.js';

export class RequestController {
  constructor(
    private readonly createUseCase: CreateServiceRequestUseCase,
    private readonly assignUseCase: AssignServiceRequestUseCase,
    private readonly updateStatusUseCase: UpdateServiceRequestStatusUseCase,
    private readonly repository: IServiceRequestRepository
  ) {}

  private getAuthContext(req: Request): { userId: string; role: Role } {
    const roleHeader = (req.headers['x-user-role'] as string)?.toUpperCase();
    const userHeader = (req.headers['x-user-id'] as string) || (req as any).user?.userId;

    let role: Role = Role.STAFF;
    if (roleHeader === 'ADMIN') role = Role.ADMIN;
    else if (roleHeader === 'REQUESTER' || roleHeader === 'CITIZEN') role = Role.REQUESTER;
    else if (roleHeader === 'STAFF') role = Role.STAFF;
    else if ((req as any).user?.role) role = (req as any).user.role;

    return {
      userId: userHeader || (role === Role.REQUESTER ? 'req-citizen-001' : 'staff-field-001'),
      role
    };
  }

  public create = async (req: Request, res: Response): Promise<void> => {
    try {
      const { categoryCode, title, description, locationAddress, isAnonymizedDisplay } = req.body;
      const auth = this.getAuthContext(req);
      const requesterId = auth.userId;

      if (!categoryCode || !title || !description || !locationAddress) {
        res.status(400).json({ error: 'Missing mandatory fields: categoryCode, title, description, locationAddress are required.' });
        return;
      }

      const request = await this.createUseCase.execute({
        requesterId,
        categoryCode,
        title,
        description,
        locationAddress,
        isAnonymizedDisplay: Boolean(isAnonymizedDisplay)
      });

      res.status(201).json(ServiceRequestDTOMapper.toDTO(request));
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };

  public getById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const request = await this.repository.findById(id);
      if (!request) {
        res.status(404).json({ error: `Service request ${id} not found.` });
        return;
      }

      const auth = this.getAuthContext(req);
      res.status(200).json(ServiceRequestDTOMapper.toDTO(request, auth.role));
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

  public list = async (req: Request, res: Response): Promise<void> => {
    try {
      const { status, departmentId, page, limit } = req.query;
      const result = await this.repository.findMany({
        status: status as any,
        departmentId: departmentId ? Number(departmentId) : undefined,
        page: page ? Number(page) : 1,
        limit: limit ? Number(limit) : 20
      });

      const auth = this.getAuthContext(req);
      res.status(200).json({
        totalCount: result.totalCount,
        requests: result.requests.map((r) => ServiceRequestDTOMapper.toDTO(r, auth.role))
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

  public assign = async (req: Request, res: Response): Promise<void> => {
    try {
      const auth = this.getAuthContext(req);
      if (auth.role !== Role.STAFF && auth.role !== Role.ADMIN) {
        res.status(403).json({ error: 'Forbidden: Insufficient privileges to assign service requests.' });
        return;
      }

      const { id } = req.params;
      const { staffId, expectedVersion } = req.body;
      const supervisorId = auth.userId || 'sup-manager-001';

      if (!staffId) {
        res.status(400).json({ error: 'staffId is required to assign ticket.' });
        return;
      }

      const updated = await this.assignUseCase.execute({
        requestId: id,
        staffId,
        supervisorId,
        expectedVersion: expectedVersion !== undefined ? Number(expectedVersion) : undefined
      });

      res.status(200).json(ServiceRequestDTOMapper.toDTO(updated));
    } catch (error: any) {
      if (error instanceof ConcurrencyConflictError) {
        res.status(409).json({ error: error.message });
      } else {
        res.status(400).json({ error: error.message });
      }
    }
  };

  public updateStatus = async (req: Request, res: Response): Promise<void> => {
    try {
      const auth = this.getAuthContext(req);
      if (auth.role !== Role.STAFF && auth.role !== Role.ADMIN) {
        res.status(403).json({ error: 'Forbidden: Insufficient privileges to update service request status.' });
        return;
      }

      const { id } = req.params;
      const { newStatus, actionNotes, expectedVersion } = req.body;
      const actorId = auth.userId || 'staff-field-001';

      if (!newStatus) {
        res.status(400).json({ error: 'newStatus is required.' });
        return;
      }

      const updated = await this.updateStatusUseCase.execute({
        requestId: id,
        actorId,
        newStatus,
        actionNotes,
        expectedVersion: expectedVersion !== undefined ? Number(expectedVersion) : undefined
      });

      res.status(200).json(ServiceRequestDTOMapper.toDTO(updated));
    } catch (error: any) {
      if (error instanceof ConcurrencyConflictError) {
        res.status(409).json({ error: error.message });
      } else {
        res.status(400).json({ error: error.message });
      }
    }
  };
}
