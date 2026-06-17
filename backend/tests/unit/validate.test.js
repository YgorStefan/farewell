import { describe, it, expect, vi } from 'vitest';
import { validate, velorioSchemas } from '../../src/middlewares/validate.js';
import { AppError } from '../../src/errors/AppError.js';

function run(middleware, req) {
  const next = vi.fn();
  middleware(req, {}, next);
  return next;
}

describe('validate middleware', () => {
  it('coage o id do banner para numero inteiro', () => {
    const req = { params: { id: '1' } };
    const next = run(validate(velorioSchemas.banner), req);

    expect(next).toHaveBeenCalledWith();
    expect(req.validated.params.id).toBe(1);
  });

  it('rejeita id nao numerico com AppError 400', () => {
    const req = { params: { id: 'abc' } };
    const next = run(validate(velorioSchemas.banner), req);

    const error = next.mock.calls[0][0];
    expect(error).toBeInstanceOf(AppError);
    expect(error.statusCode).toBe(400);
  });

  it('aceita query sem registro (filtro opcional)', () => {
    const req = { query: {} };
    const next = run(validate(velorioSchemas.list), req);
    expect(next).toHaveBeenCalledWith();
    expect(req.validated.query.registro).toBeUndefined();
  });

  it('rejeita registro acima do tamanho maximo', () => {
    const req = { query: { registro: 'x'.repeat(51) } };
    const next = run(validate(velorioSchemas.list), req);
    const error = next.mock.calls[0][0];
    expect(error).toBeInstanceOf(AppError);
    expect(error.statusCode).toBe(400);
  });
});
