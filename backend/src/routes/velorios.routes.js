import { Router } from 'express';
import { validate, velorioSchemas } from '../middlewares/validate.js';

/**
 * @param {import('../controllers/VelorioController.js').VelorioController} controller
 */
export function createVelorioRouter(controller) {
  const router = Router();

  router.get(
    '/',
    validate(velorioSchemas.list),
    controller.listarAtivos
  );

  router.get(
    '/:id/banner.pdf',
    validate(velorioSchemas.banner),
    controller.exportarBanner
  );

  return router;
}
