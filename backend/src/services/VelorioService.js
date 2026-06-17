import { AppError } from '../errors/AppError.js';

export class VelorioService {
  #repository;

  /** @param {import('../repositories/VelorioRepository.js').VelorioRepository} repository */
  constructor(repository) {
    this.#repository = repository;
  }

  /**
   * @param {{ registro?: string | null }} [filter]
   * @returns {Promise<object[]>}
   */
  async listarAtivos(filter = {}) {
    const registro = this.#normalizeRegistro(filter.registro);
    const rows = await this.#repository.findAtivos({ registro });
    return rows.map((row) => this.#toDTO(row));
  }

  /**
   * @param {number} id
   * @returns {Promise<object>}
   */
  async buscarAtivoPorId(id) {
    const row = await this.#repository.findAtivoById(id);
    if (!row) {
      throw AppError.notFound('Velorio em andamento nao encontrado');
    }
    return this.#toDTO(row);
  }

  #normalizeRegistro(registro) {
    if (typeof registro !== 'string') return null;
    const trimmed = registro.trim();
    return trimmed.length > 0 ? trimmed : null;
  }

  #toDTO(row) {
    return {
      id: row.id,
      nomeCompleto: row.nome_completo,
      numeroRegistro: row.numero_registro,
      funeraria: row.funeraria,
      sala: row.sala_velorio,
      localVelorio: row.local_velorio,
      inicioVelorio: row.inicio_velorio,
      inicioSepultamento: row.inicio_sepultamento,
      localSepultamento: row.local_sepultamento,
    };
  }
}
