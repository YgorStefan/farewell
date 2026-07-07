export class AdminController {
  #service;
  #authService;

  /**
   * @param {object} deps
   * @param {import('../services/AdminService.js').AdminService} deps.service
   * @param {import('../services/AuthService.js').AuthService} deps.authService
   */
  constructor({ service, authService }) {
    this.#service = service;
    this.#authService = authService;

    // Bind all methods
    const methods = [
      'login',
      'listarPessoas', 'buscarPessoa', 'criarPessoa', 'atualizarPessoa', 'excluirPessoa',
      'listarRegistros', 'buscarRegistro', 'criarRegistro', 'atualizarRegistro', 'excluirRegistro',
      'listarVelorios', 'buscarVelorio', 'criarVelorio', 'atualizarVelorio', 'excluirVelorio',
      'lookupPessoas', 'lookupRegistros',
    ];
    for (const method of methods) {
      this[method] = this[method].bind(this);
    }
  }

  async login(req, res, next) {
    try {
      const { password } = req.validated.body;
      const token = this.#authService.login(password);
      res.json({ token });
    } catch (error) {
      next(error);
    }
  }

  // ──── Pessoas ────

  async listarPessoas(req, res, next) {
    try {
      const search = req.validated?.query?.search ?? null;
      const data = await this.#service.listarPessoas({ search });
      res.json({ data, total: data.length });
    } catch (error) { next(error); }
  }

  async buscarPessoa(req, res, next) {
    try {
      const { id } = req.validated.params;
      const data = await this.#service.buscarPessoa(id);
      res.json({ data });
    } catch (error) { next(error); }
  }

  async criarPessoa(req, res, next) {
    try {
      const data = await this.#service.criarPessoa(req.validated.body);
      res.status(201).json({ data });
    } catch (error) { next(error); }
  }

  async atualizarPessoa(req, res, next) {
    try {
      const { id } = req.validated.params;
      const data = await this.#service.atualizarPessoa(id, req.validated.body);
      res.json({ data });
    } catch (error) { next(error); }
  }

  async excluirPessoa(req, res, next) {
    try {
      const { id } = req.validated.params;
      await this.#service.excluirPessoa(id);
      res.status(204).end();
    } catch (error) { next(error); }
  }

  // ──── Registros de Óbito ────

  async listarRegistros(req, res, next) {
    try {
      const search = req.validated?.query?.search ?? null;
      const data = await this.#service.listarRegistros({ search });
      res.json({ data, total: data.length });
    } catch (error) { next(error); }
  }

  async buscarRegistro(req, res, next) {
    try {
      const { id } = req.validated.params;
      const data = await this.#service.buscarRegistro(id);
      res.json({ data });
    } catch (error) { next(error); }
  }

  async criarRegistro(req, res, next) {
    try {
      const data = await this.#service.criarRegistro(req.validated.body);
      res.status(201).json({ data });
    } catch (error) { next(error); }
  }

  async atualizarRegistro(req, res, next) {
    try {
      const { id } = req.validated.params;
      const data = await this.#service.atualizarRegistro(id, req.validated.body);
      res.json({ data });
    } catch (error) { next(error); }
  }

  async excluirRegistro(req, res, next) {
    try {
      const { id } = req.validated.params;
      await this.#service.excluirRegistro(id);
      res.status(204).end();
    } catch (error) { next(error); }
  }

  // ──── Velórios ────

  async listarVelorios(req, res, next) {
    try {
      const search = req.validated?.query?.search ?? null;
      const data = await this.#service.listarVelorios({ search });
      res.json({ data, total: data.length });
    } catch (error) { next(error); }
  }

  async buscarVelorio(req, res, next) {
    try {
      const { id } = req.validated.params;
      const data = await this.#service.buscarVelorio(id);
      res.json({ data });
    } catch (error) { next(error); }
  }

  async criarVelorio(req, res, next) {
    try {
      const data = await this.#service.criarVelorio(req.validated.body);
      res.status(201).json({ data });
    } catch (error) { next(error); }
  }

  async atualizarVelorio(req, res, next) {
    try {
      const { id } = req.validated.params;
      const data = await this.#service.atualizarVelorio(id, req.validated.body);
      res.json({ data });
    } catch (error) { next(error); }
  }

  async excluirVelorio(req, res, next) {
    try {
      const { id } = req.validated.params;
      await this.#service.excluirVelorio(id);
      res.status(204).end();
    } catch (error) { next(error); }
  }

  // ──── Lookups ────

  async lookupPessoas(req, res, next) {
    try {
      const data = await this.#service.listarPessoasLookup();
      res.json({ data });
    } catch (error) { next(error); }
  }

  async lookupRegistros(req, res, next) {
    try {
      const data = await this.#service.listarRegistrosLookup();
      res.json({ data });
    } catch (error) { next(error); }
  }
}
