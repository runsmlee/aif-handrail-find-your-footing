import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MoodInsights } from '../components/MoodInsights';
import type { MoodEntry } from '../hooks/useMoodHistory';

// Mock IntersectionObserver
class MockIntersectionObserver {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
}
window.IntersectionObserver = MockIntersectionObserver as unknown as typeof IntersectionObserver;

describe('MoodInsights', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders empty state when no history', () => {
    render(<MoodInsights history={[]} />);
    expect(screen.getByText('Mood Insights')).toBeInTheDocument();
    expect(screen.getByText(/Check in a few more times/)).toBeInTheDocument();
  });

  it('renders empty state with single entry', () => {
    const history: MoodEntry[] = [
      { value: 'great', label: 'Great', emoji: '\u{1F60A}', timestamp: Date.now() },
    ];
    render(<MoodInsights history={history} />);
    expect(screen.getByText(/Check in a few more times/)).toBeInTheDocument();
  });

  it('shows insights with multiple entries', () => {
    const history: MoodEntry[] = [
      { value: 'great', label: 'Great', emoji: '\u{1F60A}', timestamp: Date.now() },
      { value: 'good', label: 'Good', emoji: '\u{1F642}', timestamp: Date.now() - 86400000 },
      { value: 'okay', label: 'Okay', emoji: '\u{1F610}', timestamp: Date.now() - 172800000 },
      { value: 'great', label: 'Great', emoji: '\u{1F60A}', timestamp: Date.now() - 259200000 },
      { value: 'good', label: 'Good', emoji: '\u{1F642}', timestamp: Date.now() - 345600000 },
    ];
    render(<MoodInsights history={history} />);
    expect(screen.getByText('Patterns and observations from your check-in history.')).toBeInTheDocument();
  });

  it('shows consistent check-ins insight for 5+ entries', () => {
    const history: MoodEntry[] = Array.from({ length: 6 }, (_, i) => ({
      value: 'good',
      label: 'Good',
      emoji: '\u{1F642}',
      timestamp: Date.now() - i * 86400000,
    }));
    render(<MoodInsights history={history} />);
    expect(screen.getByText('Consistent check-ins')).toBeInTheDocument();
  });

  it('shows most common mood insight', () => {
    const history: MoodEntry[] = [
      { value: 'great', label: 'Great', emoji: '\u{1F60A}', timestamp: Date.now() },
      { value: 'great', label: 'Great', emoji: '\u{1F60A}', timestamp: Date.now() - 86400000 },
      { value: 'okay', label: 'Okay', emoji: '\u{1F610}', timestamp: Date.now() - 172800000 },
    ];
    render(<MoodInsights history={history} />);
    expect(screen.getByText(/Most common: Great/)).toBeInTheDocument();
  });

  it('shows upward trend when mood improves', () => {
    const history: MoodEntry[] = [
      { value: 'great', label: 'Great', emoji: '\u{1F60A}', timestamp: Date.now() },
      { value: 'great', label: 'Great', emoji: '\u{1F60A}', timestamp: Date.now() - 3600000 },
      { value: 'great', label: 'Great', emoji: '\u{1F60A}', timestamp: Date.now() - 7200000 },
      { value: 'struggling', label: 'Struggling', emoji: '\u{1F622}', timestamp: Date.now() - 86400000 },
      { value: 'low', label: 'Low', emoji: '\u{1F614}', timestamp: Date.now() - 90000000 },
      { value: 'struggling', label: 'Struggling', emoji: '\u{1F622}', timestamp: Date.now() - 95000000 },
    ];
    render(<MoodInsights history={history} />);
    expect(screen.getByText('Upward trend')).toBeInTheDocument();
  });
});
