import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SearchBar } from '../../src/components/SearchBar.jsx';

describe('SearchBar', () => {
  it('chama onChange ao digitar', async () => {
    const onChange = vi.fn();
    render(<SearchBar value="" onChange={onChange} />);

    const input = screen.getByLabelText(/Registro de Óbito/i);
    await userEvent.type(input, 'R');
    expect(onChange).toHaveBeenCalledWith('R');
  });

  it('mostra o botao de limpar apenas quando ha valor e limpa ao clicar', async () => {
    const onChange = vi.fn();
    const { rerender } = render(<SearchBar value="" onChange={onChange} />);
    expect(screen.queryByLabelText('Limpar filtro')).not.toBeInTheDocument();

    rerender(<SearchBar value="REG-1" onChange={onChange} />);
    const clear = screen.getByLabelText('Limpar filtro');
    await userEvent.click(clear);
    expect(onChange).toHaveBeenCalledWith('');
  });
});
