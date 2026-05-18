import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Footer } from '../components/Footer';

describe('Footer', () => {
  it('renders the brand name', () => {
    render(<Footer />);
    expect(screen.getByText('Handrail')).toBeInTheDocument();
  });

  it('renders the copyright notice', () => {
    render(<Footer />);
    const currentYear = new Date().getFullYear();
    expect(screen.getByText(new RegExp(`© ${currentYear} Handrail\\.`))).toBeInTheDocument();
  });

  it('renders the disclaimer', () => {
    render(<Footer />);
    expect(screen.getByText(/Not a substitute for professional care/)).toBeInTheDocument();
  });

  it('renders footer navigation links', () => {
    render(<Footer />);
    expect(screen.getByText('Check In')).toBeInTheDocument();
    expect(screen.getByText('Breathe')).toBeInTheDocument();
    expect(screen.getByText('Ground')).toBeInTheDocument();
    expect(screen.getByText('Gratitude')).toBeInTheDocument();
    expect(screen.getByText('Support')).toBeInTheDocument();
  });

  it('renders navigation links with correct hrefs', () => {
    render(<Footer />);
    const links = screen.getAllByRole('link');
    const hrefs = links.map(l => l.getAttribute('href'));
    expect(hrefs).toContain('#mood');
    expect(hrefs).toContain('#breathe');
    expect(hrefs).toContain('#grounding');
    expect(hrefs).toContain('#gratitude');
    expect(hrefs).toContain('#crisis');
  });

  it('renders with contentinfo role', () => {
    render(<Footer />);
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
  });

  it('renders footer navigation with accessible label', () => {
    render(<Footer />);
    expect(screen.getByRole('navigation', { name: 'Footer navigation' })).toBeInTheDocument();
  });
});
