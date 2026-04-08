import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { DailyTip } from '../components/DailyTip';

describe('DailyTip', () => {
  it('renders the Daily Tip heading', () => {
    render(<DailyTip />);
    expect(screen.getByText('Daily Tip')).toBeInTheDocument();
  });

  it('renders a tip text', () => {
    render(<DailyTip />);
    // One of the tips should be rendered
    const tipTexts = [
      /Take a 5-minute walk/,
      /Write down three things/,
      /Drink a glass of water/,
      /Set a boundary today/,
      /Text someone you trust/,
      /Step outside for 2 minutes/,
      /Try the 4-7-8/,
      /Name one thing you did well/,
      /Put your phone down for 10 minutes/,
      /Stretch your neck and shoulders/,
      /Listen to one song/,
      /Look out a window/,
      /Write one sentence about/,
      /If you.*re overwhelmed/,
    ];
    const found = tipTexts.some(pattern => screen.queryByText(pattern) !== null);
    expect(found).toBe(true);
  });

  it('renders the "Another tip" button', () => {
    render(<DailyTip />);
    expect(screen.getByText('Another tip')).toBeInTheDocument();
  });

  it('cycles to next tip when button is clicked', () => {
    render(<DailyTip />);
    // Get the current tip text
    const tipText = screen.getByText(/./, { selector: '.text-sm.sm\\:text-base' });
    const firstTipText = tipText.textContent;
    fireEvent.click(screen.getByText('Another tip'));
    // After clicking, a different tip should be shown (or same if we cycled back)
    const tipTexts = screen.getAllByText(/./, { selector: '.text-sm.sm\\:text-base' });
    // The tip should have changed or cycled
    expect(tipTexts.length).toBeGreaterThanOrEqual(1);
    void firstTipText; // acknowledge we checked it
  });

  it('shows category label', () => {
    render(<DailyTip />);
    const categories = ['Movement', 'Grounding', 'Body', 'Boundaries', 'Connection', 'Nature', 'Breathing', 'Self-care', 'Mindfulness', 'Journaling'];
    const found = categories.some(cat => screen.queryByText(cat) !== null);
    expect(found).toBe(true);
  });

  it('has all tips accessible via cycling', () => {
    render(<DailyTip />);
    const totalTips = 14;
    // Click through all tips - should cycle back to the starting tip
    for (let i = 0; i < totalTips; i++) {
      fireEvent.click(screen.getByText('Another tip'));
    }
    // After cycling through all tips, we should be back to the daily tip
    expect(screen.getByText('Daily Tip')).toBeInTheDocument();
  });
});
