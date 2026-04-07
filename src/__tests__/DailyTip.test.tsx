import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { DailyTip } from '../components/DailyTip';

describe('DailyTip', () => {
  it('renders the Daily Tip heading', () => {
    render(<DailyTip />);
    expect(screen.getByText('Daily Tip')).toBeInTheDocument();
  });

  it('renders the first tip text', () => {
    render(<DailyTip />);
    expect(screen.getByText(/Take a 5-minute walk/)).toBeInTheDocument();
  });

  it('renders the "Another tip" button', () => {
    render(<DailyTip />);
    expect(screen.getByText('Another tip')).toBeInTheDocument();
  });

  it('cycles to next tip when button is clicked', () => {
    render(<DailyTip />);
    const firstTip = screen.getByText(/Take a 5-minute walk/);
    expect(firstTip).toBeInTheDocument();
    fireEvent.click(screen.getByText('Another tip'));
    expect(screen.getByText(/Write down three things/)).toBeInTheDocument();
  });

  it('shows category label', () => {
    render(<DailyTip />);
    expect(screen.getByText('Movement')).toBeInTheDocument();
  });

  it('cycles back to first tip after all tips', () => {
    render(<DailyTip />);
    const totalTips = 14; // number of tips in TIPS array
    for (let i = 0; i < totalTips; i++) {
      fireEvent.click(screen.getByText('Another tip'));
    }
    expect(screen.getByText(/Take a 5-minute walk/)).toBeInTheDocument();
  });
});
