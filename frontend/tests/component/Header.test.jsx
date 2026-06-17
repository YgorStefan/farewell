import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Header } from '../../src/components/Header.jsx';

describe('Header', () => {
  it('mostra as contagens por fase e o total', () => {
    render(
      <Header total={9} emVelorio={4} emSepultamento={5} lastUpdated={null} refreshing={false} />
    );
    expect(screen.getByText(/4 em velório/)).toBeInTheDocument();
    expect(screen.getByText(/5 em sepultamento/)).toBeInTheDocument();
    expect(screen.getByText(/9 no total/)).toBeInTheDocument();
  });

  it('exibe o horario da ultima atualizacao quando informado', () => {
    render(
      <Header
        total={3}
        emVelorio={1}
        emSepultamento={2}
        lastUpdated={new Date('2026-06-22T08:00:00.000Z')}
        refreshing={false}
      />
    );
    expect(screen.getByText(/Atualizado às/)).toBeInTheDocument();
  });
});
