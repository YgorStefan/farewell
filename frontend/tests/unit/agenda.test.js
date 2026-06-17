import { describe, it, expect } from 'vitest';
import { splitAgenda } from '../../src/utils/agenda.js';

const now = new Date('2026-06-24T12:00:00.000Z');

function velorio(id, inicioSepultamento) {
  return { id, inicioSepultamento };
}

describe('splitAgenda', () => {
  it('classifica como em sepultamento quando o sepultamento ja comecou', () => {
    const { emVelorio, emSepultamento } = splitAgenda(
      [velorio(1, '2026-06-24T10:00:00.000Z')],
      now
    );
    expect(emSepultamento.map((v) => v.id)).toEqual([1]);
    expect(emVelorio).toHaveLength(0);
  });

  it('classifica como em velorio quando o sepultamento ainda nao comecou', () => {
    const { emVelorio, emSepultamento } = splitAgenda(
      [velorio(1, '2026-06-24T15:00:00.000Z')],
      now
    );
    expect(emVelorio.map((v) => v.id)).toEqual([1]);
    expect(emSepultamento).toHaveLength(0);
  });

  it('trata sepultamento ausente como velorio em curso', () => {
    const { emVelorio } = splitAgenda([velorio(1, null)], now);
    expect(emVelorio.map((v) => v.id)).toEqual([1]);
  });

  it('nao descarta nenhum velorio, mesmo com sepultamento de dias anteriores', () => {
    const velorios = [
      velorio(1, '2026-06-20T09:00:00.000Z'),
      velorio(2, '2026-06-24T15:00:00.000Z'),
      velorio(3, '2026-06-24T11:00:00.000Z'),
    ];
    const { emVelorio, emSepultamento } = splitAgenda(velorios, now);
    expect(emVelorio.length + emSepultamento.length).toBe(3);
    expect(emSepultamento.map((v) => v.id)).toContain(1);
  });

  it('ordena cada grupo pelo horario do sepultamento', () => {
    const velorios = [
      velorio(1, '2026-06-24T16:00:00.000Z'),
      velorio(2, '2026-06-24T14:00:00.000Z'),
    ];
    const { emVelorio } = splitAgenda(velorios, now);
    expect(emVelorio.map((v) => v.id)).toEqual([2, 1]);
  });
});
