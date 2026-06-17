import { describe, it, expect } from 'vitest';
import { formatDateTime, formatTime } from '../../src/utils/formatDate.js';

const iso = '2026-06-22T08:00:00.000Z';

describe('formatDateTime', () => {
  it('formata data e hora em pt-BR (fuso America/Sao_Paulo)', () => {
    const out = formatDateTime(iso);
    expect(out).toContain('22/06/2026');
    expect(out).toContain('05:00');
  });

  it('retorna "-" para valor ausente', () => {
    expect(formatDateTime(null)).toBe('-');
    expect(formatDateTime(undefined)).toBe('-');
  });

  it('retorna "-" para data invalida', () => {
    expect(formatDateTime('nao-e-data')).toBe('-');
  });
});

describe('formatTime', () => {
  it('formata apenas o horario', () => {
    expect(formatTime(iso)).toBe('05:00');
  });

  it('retorna "-" para valor ausente', () => {
    expect(formatTime(null)).toBe('-');
  });
});
