import { Router } from 'express';
import { RequestController } from '../controllers/RequestController.js';
import { CreateServiceRequestUseCase } from '../../application/use-cases/CreateServiceRequest.js';
import { AssignServiceRequestUseCase } from '../../application/use-cases/AssignServiceRequest.js';
import { UpdateServiceRequestStatusUseCase } from '../../application/use-cases/UpdateServiceRequestStatus.js';
import { IServiceRequestRepository } from '../../domain/repositories/IServiceRequestRepository.js';
import { InMemoryServiceRequestRepository } from '../../infrastructure/repositories/InMemoryServiceRequestRepository.js';

export function createRequestRouter(repository: IServiceRequestRepository = new InMemoryServiceRequestRepository()): Router {
  const router = Router();

  const createUseCase = new CreateServiceRequestUseCase(repository);
  const assignUseCase = new AssignServiceRequestUseCase(repository);
  const updateStatusUseCase = new UpdateServiceRequestStatusUseCase(repository);
  const controller = new RequestController(createUseCase, assignUseCase, updateStatusUseCase, repository);

  router.post('/', controller.create);
  router.get('/', controller.list);
  router.get('/:id', controller.getById);
  router.patch('/:id/assign', controller.assign);
  router.patch('/:id/status', controller.updateStatus);

  return router;
}
