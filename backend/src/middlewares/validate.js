import { z } from 'zod';
import { AppError } from '../errors/AppError.js';

/**
 * @param {{ params?: z.ZodTypeAny, query?: z.ZodTypeAny }} schemas
 */
export function validate(schemas) {
  return (req, _res, next) => {
    try {
      req.validated = {};
      if (schemas.params) {
        req.validated.params = schemas.params.parse(req.params);
      }
      if (schemas.query) {
        req.validated.query = schemas.query.parse(req.query);
      }
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const message = error.issues
          .map((issue) => issue.message)
          .join('; ');
        next(new AppError(`Parametros invalidos: ${message}`, 400));
        return;
      }
      next(error);
    }
  };
}

export const velorioSchemas = {
  list: {
    query: z.object({
      registro: z
        .string()
        .trim()
        .max(50, 'registro excede o tamanho maximo')
        .optional(),
    }),
  },
  banner: {
    params: z.object({
      id: z.coerce
        .number({ invalid_type_error: 'id deve ser numerico' })
        .int('id deve ser inteiro')
        .positive('id deve ser positivo'),
    }),
  },
};
