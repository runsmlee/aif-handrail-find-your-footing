import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { QuickActions } from '../components/QuickActions';

describe('QuickActions', () => {
  it('renders all four action cards', () => {
    render(<QuickActions />);
    expect(screen.getByText('Check Your Mood')).toBeInTheDocument();
    expect(screen.getByText('Breathe')).toBeInTheDocument();
    expect(screen.getByText('Ground Yourself')).toBeInTheDocument();
    expect(screen.getByText('Write Gratitude')).toBeInTheDocument();
  });

  it('renders action descriptions', () => {
    render(<QuickActions />);
    expect(screen.getByText('Quick self-assessment')).toBeInTheDocument();
    expect(screen.getByText('4-4-4 box breathing')).toBeInTheDocument();
    expect(screen.getByText('5-4-3-2-1 sensory')).toBeInTheDocument();
    expect(screen.getByText('Shift your perspective')).toBeInTheDocument();
  });

  it('renders links to correct sections', () => {
    render(<QuickActions />);
    const links = screen.getAllByRole('link');
    const hrefs = links.map(l => l.getAttribute('href'));
    expect(hrefs).toContain('#mood');
    expect(hrefs).toContain('#breathe');
    expect(hrefs).toContain('#grounding');
    expect(hrefs).toContain('#gratitude');
  });
});
