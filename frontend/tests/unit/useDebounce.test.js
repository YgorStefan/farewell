import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useDebounce } from '../../src/hooks/useDebounce.js';

describe('useDebounce', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('so atualiza o valor apos o atraso', () => {
    const { result, rerender } = renderHook(({ v }) => useDebounce(v, 400), {
      initialProps: { v: 'a' },
    });
    expect(result.current).toBe('a');

    rerender({ v: 'ab' });
    expect(result.current).toBe('a');

    act(() => vi.advanceTimersByTime(399));
    expect(result.current).toBe('a');

    act(() => vi.advanceTimersByTime(1));
    expect(result.current).toBe('ab');
  });

  it('reinicia o timer a cada mudanca rapida (so o ultimo vale)', () => {
    const { result, rerender } = renderHook(({ v }) => useDebounce(v, 300), {
      initialProps: { v: '1' },
    });

    rerender({ v: '12' });
    act(() => vi.advanceTimersByTime(200));
    rerender({ v: '123' });
    act(() => vi.advanceTimersByTime(200));
    expect(result.current).toBe('1');

    act(() => vi.advanceTimersByTime(100));
    expect(result.current).toBe('123');
  });
});
