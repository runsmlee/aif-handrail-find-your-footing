import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Hero } from '../components/Hero';

describe('Hero', () => {
  it('renders the main heading', () => {
    render(<Hero />);
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent('Find Your Footing');
  });

  it('renders the description text', () => {
    render(<Hero />);
    expect(screen.getByText(/A gentle space to check in with yourself/)).toBeInTheDocument();
  });

  it('renders the CTA buttons', () => {
    render(<Hero />);
    expect(screen.getByText('Start Checking In')).toBeInTheDocument();
    expect(screen.getByText('Try Breathing Exercise')).toBeInTheDocument();
  });

  it('renders trust indicators', () => {
    render(<Hero />);
    expect(screen.getByText('Free & private')).toBeInTheDocument();
    expect(screen.getByText('Evidence-based techniques')).toBeInTheDocument();
    expect(screen.getByText('No account required')).toBeInTheDocument();
  });

  it('renders the badge', () => {
    render(<Hero />);
    expect(screen.getByText('Your daily wellness companion')).toBeInTheDocument();
  });

  it('does not render streak when streak is 0', () => {
    render(<Hero streak={0} />);
    expect(screen.queryByText(/day streak/)).not.toBeInTheDocument();
  });

  it('renders streak indicator when streak > 0', () => {
    render(<Hero streak={3} />);
    expect(screen.getByText('3 days streak')).toBeInTheDocument();
  });

  it('renders singular day for streak of 1', () => {
    render(<Hero streak={1} />);
    expect(screen.getByText('1 day streak')).toBeInTheDocument();
  });
});
