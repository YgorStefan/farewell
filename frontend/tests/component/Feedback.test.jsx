import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LoadingGrid, ErrorState, EmptyState } from '../../src/components/Feedback.jsx';

describe('Feedback', () => {
  it('LoadingGrid renderiza placeholders de skeleton', () => {
    const { container } = render(<LoadingGrid />);
    expect(container.querySelectorAll('.row--skeleton')).toHaveLength(5);
  });

  it('ErrorState mostra a mensagem e aciona o retry', async () => {
    const onRetry = vi.fn();
    render(<ErrorState message="Falha de rede" onRetry={onRetry} />);
    expect(screen.getByText('Falha de rede')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: /Tentar novamente/i }));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('EmptyState diferencia filtro vazio de ausencia total', () => {
    const { rerender } = render(<EmptyState filtered={false} />);
    expect(screen.getByText(/Nenhum velório em andamento/i)).toBeInTheDocument();

    rerender(<EmptyState filtered />);
    expect(screen.getByText(/Nenhum atendimento para este registro/i)).toBeInTheDocument();
  });
});
