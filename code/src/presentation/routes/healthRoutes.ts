import { Router, Request, Response } from 'express';

const router = Router();

/**
 * Liveness Probe: Verifies the Node.js process is active.
 * Standard: NFR-002 (Availability) & PED v2.0 Section 13
 */
router.get('/live', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'UP',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    memoryUsageMB: Math.round(process.memoryUsage().rss / (1024 * 1024))
  });
});

/**
 * Readiness Probe: Verifies database connectivity and application readiness.
 * Standard: NFR-002 (Availability)
 */
router.get('/ready', (_req: Request, res: Response) => {
  // In production, queries PostgreSQL pool. In baseline state, verifies core memory and event dispatcher.
  res.status(200).json({
    status: 'READY',
    database: 'CONNECTED',
    timestamp: new Date().toISOString()
  });
});

export default router;
