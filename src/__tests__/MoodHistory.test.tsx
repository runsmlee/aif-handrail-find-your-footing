import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MoodHistory } from '../components/MoodHistory';
import type { MoodEntry } from '../hooks/useMoodHistory';

describe('MoodHistory', () => {
  it('renders empty state when no history', () => {
    render(<MoodHistory history={[]} onClear={() => {}} />);
    expect(screen.getByText(/Your mood history will appear here/)).toBeInTheDocument();
  });

  it('renders mood entries from history', () => {
    const history: MoodEntry[] = [
      { value: 'great', label: 'Great', emoji: '\u{1F60A}', timestamp: Date.now() - 60000 },
      { value: 'okay', label: 'Okay', emoji: '\u{1F610}', timestamp: Date.now() - 3600000 },
    ];
    render(<MoodHistory history={history} onClear={() => {}} />);
    expect(screen.getByText('Great')).toBeInTheDocument();
    expect(screen.getByText('Okay')).toBeInTheDocument();
  });

  it('shows relative timestamps', () => {
    const history: MoodEntry[] = [
      { value: 'great', label: 'Great', emoji: '\u{1F60A}', timestamp: Date.now() - 60000 },
    ];
    render(<MoodHistory history={history} onClear={() => {}} />);
    expect(screen.getByText('1m ago')).toBeInTheDocument();
  });

  it('shows trend label for multiple entries', () => {
    const history: MoodEntry[] = [
      { value: 'great', label: 'Great', emoji: '\u{1F60A}', timestamp: Date.now() - 60000 },
      { value: 'good', label: 'Good', emoji: '\u{1F642}', timestamp: Date.now() - 3600000 },
    ];
    render(<MoodHistory history={history} onClear={() => {}} />);
    expect(screen.getByText('trending positive')).toBeInTheDocument();
  });

  it('shows clear button when there are entries', () => {
    const history: MoodEntry[] = [
      { value: 'great', label: 'Great', emoji: '\u{1F60A}', timestamp: Date.now() },
      { value: 'good', label: 'Good', emoji: '\u{1F642}', timestamp: Date.now() - 1000 },
    ];
    render(<MoodHistory history={history} onClear={() => {}} />);
    expect(screen.getByText('Clear history')).toBeInTheDocument();
  });

  it('does not show clear button with single entry', () => {
    const history: MoodEntry[] = [
      { value: 'great', label: 'Great', emoji: '\u{1F60A}', timestamp: Date.now() },
    ];
    render(<MoodHistory history={history} onClear={() => {}} />);
    expect(screen.queryByText('Clear history')).not.toBeInTheDocument();
  });

  it('limits displayed entries to 7', () => {
    const history: MoodEntry[] = Array.from({ length: 10 }, (_, i) => ({
      value: 'okay',
      label: 'Okay',
      emoji: '\u{1F610}',
      timestamp: Date.now() - i * 60000,
    }));
    render(<MoodHistory history={history} onClear={() => {}} />);
    const items = screen.getAllByRole('listitem');
    expect(items).toHaveLength(7);
  });
});
