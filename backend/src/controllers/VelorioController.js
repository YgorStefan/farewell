export class VelorioController {
  #service;
  #pdfService;

  /**
   * @param {object} deps
   * @param {import('../services/VelorioService.js').VelorioService} deps.service
   * @param {import('../services/BannerPdfService.js').BannerPdfService} deps.pdfService
   */
  constructor({ service, pdfService }) {
    this.#service = service;
    this.#pdfService = pdfService;

    this.listarAtivos = this.listarAtivos.bind(this);
    this.exportarBanner = this.exportarBanner.bind(this);
  }

  async listarAtivos(req, res, next) {
    try {
      const registro = req.validated?.query?.registro ?? null;
      const velorios = await this.#service.listarAtivos({ registro });
      res.json({ data: velorios, total: velorios.length });
    } catch (error) {
      next(error);
    }
  }

  async exportarBanner(req, res, next) {
    try {
      const { id } = req.validated.params;
      const velorio = await this.#service.buscarAtivoPorId(id);

      const doc = this.#pdfService.build(velorio);
      const filename = `banner-velorio-${velorio.numeroRegistro}.pdf`;

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="${filename}"`
      );

      doc.pipe(res);
      doc.end();
    } catch (error) {
      next(error);
    }
  }
}
