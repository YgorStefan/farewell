import { describe, it, expect } from 'vitest';
import { AppError } from '../../src/errors/AppError.js';

describe('AppError', () => {
  it('usa status 400 por padrao e marca como operacional', () => {
    const error = new AppError('algo invalido');
    expect(error).toBeInstanceOf(Error);
    expect(error.statusCode).toBe(400);
    expect(error.isOperational).toBe(true);
    expect(error.message).toBe('algo invalido');
  });

  it('aceita status customizado', () => {
    const error = new AppError('proibido', 403);
    expect(error.statusCode).toBe(403);
  });

  it('notFound() produz erro 404', () => {
    const error = AppError.notFound();
    expect(error.statusCode).toBe(404);
    expect(error).toBeInstanceOf(AppError);
  });
});
