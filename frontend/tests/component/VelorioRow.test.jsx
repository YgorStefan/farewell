import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { VelorioRow } from '../../src/components/VelorioRow.jsx';

const velorio = {
  id: 1,
  nomeCompleto: 'João Silva',
  numeroRegistro: 'REG-2026-0001',
  funeraria: 'Funerária Bom Pastor',
  sala: 'Sala Lírio',
  inicioVelorio: '2026-06-22T08:00:00.000Z',
  inicioSepultamento: '2026-06-24T10:00:00.000Z',
  localSepultamento: 'Cemitério Municipal',
};

describe('VelorioRow', () => {
  it('renderiza os dados do atendimento', () => {
    render(<VelorioRow velorio={velorio} onExport={vi.fn()} exporting={false} />);
    expect(screen.getByText('João Silva')).toBeInTheDocument();
    expect(screen.getByText('REG-2026-0001')).toBeInTheDocument();
    expect(screen.getByText('Sala Lírio')).toBeInTheDocument();
    expect(screen.getByText('Funerária Bom Pastor')).toBeInTheDocument();
    expect(screen.getByText('Cemitério Municipal')).toBeInTheDocument();
  });

  it('aciona onExport ao clicar em Exportar Banner', async () => {
    const onExport = vi.fn();
    render(<VelorioRow velorio={velorio} onExport={onExport} exporting={false} />);
    await userEvent.click(screen.getByRole('button', { name: /Exportar Banner/i }));
    expect(onExport).toHaveBeenCalledWith(velorio);
  });

  it('desabilita o botao e mostra estado de geracao quando exporting', () => {
    render(<VelorioRow velorio={velorio} onExport={vi.fn()} exporting />);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button).toHaveTextContent(/Gerando/i);
  });
});
