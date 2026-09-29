import express, { Express, Request, Response, NextFunction } from 'express';
import healthRoutes from './presentation/routes/healthRoutes.js';
import { createRequestRouter } from './presentation/routes/requestRoutes.js';
import { IServiceRequestRepository } from './domain/repositories/IServiceRequestRepository.js';
import { InMemoryServiceRequestRepository } from './infrastructure/repositories/InMemoryServiceRequestRepository.js';

export function createApp(repository: IServiceRequestRepository = new InMemoryServiceRequestRepository()): Express {
  const app = express();

  app.use(express.json());

  // Health probes (NFR-002)
  app.use('/health', healthRoutes);

  // Core Service Request REST API (OpenAPI 3.0)
  app.use('/api/v1/requests', createRequestRouter(repository));

  // Global 404 handler
  app.use((_req: Request, res: Response) => {
    res.status(404).json({ error: 'Endpoint not found.' });
  });

  // Global centralized error middleware
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    console.error('[GlobalErrorHandler]', err);
    res.status(500).json({ error: 'Internal Server Error', message: err.message });
  });

  return app;
}
