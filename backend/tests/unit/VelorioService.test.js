import { describe, it, expect, vi, beforeEach } from 'vitest';
import { VelorioService } from '../../src/services/VelorioService.js';
import { AppError } from '../../src/errors/AppError.js';

const dbRow = {
  id: 1,
  nome_completo: 'João Silva',
  numero_registro: 'REG-2026-0001',
  funeraria: 'Funerária Bom Pastor',
  sala_velorio: 'Sala Lírio',
  local_velorio: 'Memorial Farewell',
  inicio_velorio: '2026-06-22T08:00:00.000Z',
  inicio_sepultamento: '2026-06-24T10:00:00.000Z',
  local_sepultamento: 'Cemitério Municipal',
};

describe('VelorioService', () => {
  let repository;
  let service;

  beforeEach(() => {
    repository = {
      findAtivos: vi.fn().mockResolvedValue([dbRow]),
      findAtivoById: vi.fn().mockResolvedValue(dbRow),
    };
    service = new VelorioService(repository);
  });

  it('mapeia a linha do banco para o DTO da API', async () => {
    const [dto] = await service.listarAtivos();

    expect(dto).toEqual({
      id: 1,
      nomeCompleto: 'João Silva',
      numeroRegistro: 'REG-2026-0001',
      funeraria: 'Funerária Bom Pastor',
      sala: 'Sala Lírio',
      localVelorio: 'Memorial Farewell',
      inicioVelorio: '2026-06-22T08:00:00.000Z',
      inicioSepultamento: '2026-06-24T10:00:00.000Z',
      localSepultamento: 'Cemitério Municipal',
    });
  });

  it('normaliza registro com espacos, repassando o valor podado', async () => {
    await service.listarAtivos({ registro: '  REG-2026-0001  ' });
    expect(repository.findAtivos).toHaveBeenCalledWith({ registro: 'REG-2026-0001' });
  });

  it('trata registro vazio/whitespace como null (sem filtro)', async () => {
    await service.listarAtivos({ registro: '   ' });
    expect(repository.findAtivos).toHaveBeenCalledWith({ registro: null });
  });

  it('trata registro ausente como null', async () => {
    await service.listarAtivos();
    expect(repository.findAtivos).toHaveBeenCalledWith({ registro: null });
  });

  it('retorna o DTO ao buscar por id existente', async () => {
    const dto = await service.buscarAtivoPorId(1);
    expect(dto.numeroRegistro).toBe('REG-2026-0001');
    expect(repository.findAtivoById).toHaveBeenCalledWith(1);
  });

  it('lanca AppError 404 quando o velorio nao existe', async () => {
    repository.findAtivoById.mockResolvedValue(null);
    await expect(service.buscarAtivoPorId(999)).rejects.toMatchObject({
      statusCode: 404,
    });
    await expect(service.buscarAtivoPorId(999)).rejects.toBeInstanceOf(AppError);
  });
});
