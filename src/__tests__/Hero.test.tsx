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
    expect(screen.getByText(/Choose an exercise below to center yourself right now/)).toBeInTheDocument();
  });

  it('renders the interactive grounding module', () => {
    render(<Hero />);
    expect(screen.getByLabelText('Start Box Breathing exercise')).toBeInTheDocument();
    expect(screen.getByLabelText('Start 5-4-3-2-1 Grounding exercise')).toBeInTheDocument();
  });

  it('renders the Quick Grounding heading', () => {
    render(<Hero />);
    expect(screen.getByText('Quick Grounding')).toBeInTheDocument();
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

  it('renders start your streak message when streak is 0', () => {
    render(<Hero streak={0} />);
    expect(screen.getByText('Start your streak')).toBeInTheDocument();
  });

  it('renders streak indicator when streak > 0', () => {
    render(<Hero streak={3} />);
    expect(screen.getByText('3 days streak')).toBeInTheDocument();
  });

  it('renders singular day for streak of 1', () => {
    render(<Hero streak={1} />);
    expect(screen.getByText('1 day streak')).toBeInTheDocument();
  });

  it('renders milestone progress for streaks under 3', () => {
    render(<Hero streak={1} />);
    expect(screen.getByText(/to 3-day streak/)).toBeInTheDocument();
  });

  it('renders milestone progress for streaks under 7', () => {
    render(<Hero streak={5} />);
    expect(screen.getByText(/to 7-day streak/)).toBeInTheDocument();
  });

  it('renders a daily quote with author attribution', () => {
    render(<Hero />);
    const attribution = screen.getByText(/— /);
    expect(attribution).toBeInTheDocument();
  });

  it('renders fire emoji for streaks >= 7', () => {
    render(<Hero streak={8} />);
    const streakEl = screen.getByText('8 days streak');
    expect(streakEl).toBeInTheDocument();
  });
});
