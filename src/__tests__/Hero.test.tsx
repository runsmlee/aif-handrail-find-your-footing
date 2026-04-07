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
});
