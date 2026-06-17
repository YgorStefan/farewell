import { Router } from 'express';

/**
 * @param {import('../db/Database.js').Database} database
 */
export function createHealthRouter(database) {
  const router = Router();

  router.get('/', async (_req, res) => {
    try {
      await database.healthCheck();
      res.json({ status: 'ok', database: 'up' });
    } catch {
      res.status(503).json({ status: 'degraded', database: 'down' });
    }
  });

  return router;
}
