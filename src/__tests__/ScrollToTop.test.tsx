import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ScrollToTop } from '../components/ScrollToTop';

describe('ScrollToTop', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Start with scrollY at 0
    Object.defineProperty(window, 'scrollY', { value: 0, writable: true });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('does not render when scroll position is below threshold', () => {
    render(<ScrollToTop />);
    expect(screen.queryByLabelText('Scroll to top')).not.toBeInTheDocument();
  });

  it('renders when scroll position exceeds threshold', () => {
    render(<ScrollToTop />);

    // Simulate scrolling past threshold
    Object.defineProperty(window, 'scrollY', { value: 500, writable: true });
    fireEvent.scroll(window);

    expect(screen.getByLabelText('Scroll to top')).toBeInTheDocument();
  });

  it('scrolls to top when clicked', () => {
    const scrollToSpy = vi.fn();
    window.scrollTo = scrollToSpy;

    render(<ScrollToTop />);

    // Show the button
    Object.defineProperty(window, 'scrollY', { value: 500, writable: true });
    fireEvent.scroll(window);

    fireEvent.click(screen.getByLabelText('Scroll to top'));
    expect(scrollToSpy).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
  });
});
