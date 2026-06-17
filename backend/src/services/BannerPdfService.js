import PDFDocument from 'pdfkit';
import { fileURLToPath } from 'node:url';

const LOGO_PATH = fileURLToPath(new URL('../assets/logo.png', import.meta.url));

const BRAND_BLUE = '#18547E';
const BRAND_BLUE_DARK = '#123f5f';
const BRAND_GREEN = '#23A455';
const INK = '#243b53';
const MUTED = '#7b8794';
const LINE = '#cbd2d9';

export class BannerPdfService {
  static #dateFormatter = new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
    timeZone: 'America/Sao_Paulo',
  });

  /**
   * @param {object} velorio DTO retornado por VelorioService.
   * @returns {PDFKit.PDFDocument}
   */
  build(velorio) {
    const doc = new PDFDocument({
      size: 'A4',
      layout: 'landscape',
      margin: 50,
      info: {
        Title: `Banner - ${velorio.nomeCompleto}`,
        Author: 'Memorial Luto Curitiba',
      },
    });

    this.#renderHeader(doc);
    this.#renderName(doc, velorio.nomeCompleto);
    this.#renderFields(doc, velorio);

    return doc;
  }

  #contentWidth(doc) {
    return doc.page.width - doc.page.margins.left - doc.page.margins.right;
  }

  #renderLogo(doc) {
    const left = doc.page.margins.left;
    const width = this.#contentWidth(doc);
    const size = 64;
    const x = left + (width - size) / 2;
    doc.image(LOGO_PATH, x, doc.y, { width: size, height: size });
    doc.y += size + 8;
  }

  #renderHeader(doc) {
    const left = doc.page.margins.left;
    const width = this.#contentWidth(doc);

    this.#renderLogo(doc);

    doc
      .fillColor(BRAND_BLUE)
      .font('Helvetica-Bold')
      .fontSize(15)
      .text('MEMORIAL LUTO CURITIBA', left, doc.y, {
        align: 'center',
        width,
        characterSpacing: 2,
      });

    doc.moveDown(0.8);
    doc
      .moveTo(left, doc.y)
      .lineTo(left + width, doc.y)
      .lineWidth(1)
      .strokeColor(LINE)
      .stroke();
    doc.moveDown(1.4);
  }

  #renderName(doc, nomeCompleto) {
    const left = doc.page.margins.left;
    const width = this.#contentWidth(doc);

    doc
      .fillColor(MUTED)
      .font('Helvetica')
      .fontSize(11)
      .text('EM MEMÓRIA DE', left, doc.y, {
        align: 'center',
        width,
        characterSpacing: 2,
      });

    doc.moveDown(0.5);
    doc
      .fillColor(BRAND_BLUE_DARK)
      .font('Helvetica-Bold')
      .fontSize(40)
      .text(nomeCompleto ?? '-', left, doc.y, { align: 'center', width });

    doc.moveDown(0.5);
    const accentW = 90;
    const ax = left + (width - accentW) / 2;
    doc
      .moveTo(ax, doc.y)
      .lineTo(ax + accentW, doc.y)
      .lineWidth(3)
      .lineCap('round')
      .strokeColor(BRAND_GREEN)
      .stroke();
    doc.moveDown(1.6);
  }

  #renderFields(doc, velorio) {
    const left = doc.page.margins.left;
    const width = this.#contentWidth(doc);
    const colGap = 48;
    const colW = (width - colGap) / 2;
    const rowHeight = 74;

    const fields = [
      ['Início do velório', this.#formatDate(velorio.inicioVelorio)],
      ['Início do sepultamento', this.#formatDate(velorio.inicioSepultamento)],
      ['Local do sepultamento', velorio.localSepultamento ?? '-'],
      ['Funerária responsável', velorio.funeraria ?? '-'],
    ];

    let rowY = doc.y;
    for (let i = 0; i < fields.length; i += 2) {
      this.#renderField(doc, fields[i], left, rowY, colW);
      this.#renderField(doc, fields[i + 1], left + colW + colGap, rowY, colW);
      rowY += rowHeight;
    }
    doc.y = rowY;
  }

  #renderField(doc, [label, value], x, y, width) {
    doc
      .fillColor(MUTED)
      .font('Helvetica')
      .fontSize(11)
      .text(label.toUpperCase(), x, y, { width, characterSpacing: 1, align: 'center' });

    doc
      .fillColor(INK)
      .font('Helvetica-Bold')
      .fontSize(19)
      .text(value, x, y + 18, { width, align: 'center' });
  }

  #formatDate(value) {
    if (!value) return '-';
    const date = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(date.getTime())) return '-';
    return BannerPdfService.#dateFormatter.format(date);
  }
}
