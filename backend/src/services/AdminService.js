import { AppError } from '../errors/AppError.js';

export class AdminService {
  #pessoaRepo;
  #registroRepo;
  #velorioRepo;

  /**
   * @param {object} deps
   * @param {import('../repositories/PessoaRepository.js').PessoaRepository} deps.pessoaRepository
   * @param {import('../repositories/RegistroObitoRepository.js').RegistroObitoRepository} deps.registroObitoRepository
   * @param {import('../repositories/AdminVelorioRepository.js').AdminVelorioRepository} deps.adminVelorioRepository
   */
  constructor({ pessoaRepository, registroObitoRepository, adminVelorioRepository }) {
    this.#pessoaRepo = pessoaRepository;
    this.#registroRepo = registroObitoRepository;
    this.#velorioRepo = adminVelorioRepository;
  }

  // ──── Pessoas ────

  async listarPessoas(filter = {}) {
    const search = this.#normalize(filter.search);
    return this.#pessoaRepo.findAll({ search });
  }

  async buscarPessoa(id) {
    const row = await this.#pessoaRepo.findById(id);
    if (!row) throw AppError.notFound('Pessoa nao encontrada');
    return row;
  }

  async criarPessoa(data) {
    return this.#pessoaRepo.create(data);
  }

  async atualizarPessoa(id, data) {
    const row = await this.#pessoaRepo.update(id, data);
    if (!row) throw AppError.notFound('Pessoa nao encontrada');
    return row;
  }

  async excluirPessoa(id) {
    const deleted = await this.#pessoaRepo.delete(id);
    if (!deleted) throw AppError.notFound('Pessoa nao encontrada');
  }

  // ──── Registros de Óbito ────

  async listarRegistros(filter = {}) {
    const search = this.#normalize(filter.search);
    return this.#registroRepo.findAll({ search });
  }

  async buscarRegistro(id) {
    const row = await this.#registroRepo.findById(id);
    if (!row) throw AppError.notFound('Registro de obito nao encontrado');
    return row;
  }

  async criarRegistro(data) {
    const pessoa = await this.#pessoaRepo.findById(data.pessoa_id);
    if (!pessoa) throw new AppError('Pessoa informada nao existe', 400);
    return this.#registroRepo.create(data);
  }

  async atualizarRegistro(id, data) {
    if (data.pessoa_id) {
      const pessoa = await this.#pessoaRepo.findById(data.pessoa_id);
      if (!pessoa) throw new AppError('Pessoa informada nao existe', 400);
    }
    const row = await this.#registroRepo.update(id, data);
    if (!row) throw AppError.notFound('Registro de obito nao encontrado');
    return row;
  }

  async excluirRegistro(id) {
    const deleted = await this.#registroRepo.delete(id);
    if (!deleted) throw AppError.notFound('Registro de obito nao encontrado');
  }

  // ──── Velórios ────

  async listarVelorios(filter = {}) {
    const search = this.#normalize(filter.search);
    return this.#velorioRepo.findAll({ search });
  }

  async buscarVelorio(id) {
    const row = await this.#velorioRepo.findById(id);
    if (!row) throw AppError.notFound('Velorio nao encontrado');
    return row;
  }

  async criarVelorio(data) {
    const registro = await this.#registroRepo.findById(data.registro_obito_id);
    if (!registro) throw new AppError('Registro de obito informado nao existe', 400);
    return this.#velorioRepo.create(data);
  }

  async atualizarVelorio(id, data) {
    if (data.registro_obito_id) {
      const registro = await this.#registroRepo.findById(data.registro_obito_id);
      if (!registro) throw new AppError('Registro de obito informado nao existe', 400);
    }
    const row = await this.#velorioRepo.update(id, data);
    if (!row) throw AppError.notFound('Velorio nao encontrado');
    return row;
  }

  async excluirVelorio(id) {
    const deleted = await this.#velorioRepo.delete(id);
    if (!deleted) throw AppError.notFound('Velorio nao encontrado');
  }

  // ──── Lookups (para selects de FK) ────

  async listarPessoasLookup() {
    const rows = await this.#pessoaRepo.findAll();
    return rows.map((r) => ({ id: r.id, label: `${r.nome} ${r.sobrenome} (${r.cpf})` }));
  }

  async listarRegistrosLookup() {
    const rows = await this.#registroRepo.findAll();
    return rows.map((r) => ({
      id: r.id,
      label: `${r.numero_registro} — ${r.nome_completo}`,
    }));
  }

  #normalize(value) {
    if (typeof value !== 'string') return null;
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : null;
  }
}
