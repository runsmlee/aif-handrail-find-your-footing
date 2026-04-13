import '@testing-library/jest-dom/vitest';

// Mock window.matchMedia for tests
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});

// Mock IntersectionObserver
class MockIntersectionObserver {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
}
window.IntersectionObserver = MockIntersectionObserver as unknown as typeof IntersectionObserver;

// Mock URL.createObjectURL and revokeObjectURL
vi.stubGlobal('URL', {
  ...URL,
  createObjectURL: (_blob?: Blob | MediaSource) => 'blob:mock-url',
  revokeObjectURL: (_url?: string) => {},
});

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { MoodInsights } from '../components/MoodInsights';
import { MoodHistory } from '../components/MoodHistory';
import { BreathingExercise } from '../components/BreathingExercise';
import { DailySummary } from '../components/DailySummary';
import type { MoodEntry } from '../hooks/useMoodHistory';

// Helper to create mood entries with timestamps
function createMoodEntry(value: string, label: string, emoji: string, daysAgo: number): MoodEntry {
  return {
    value,
    label,
    emoji,
    timestamp: Date.now() - daysAgo * 86400000,
  };
}

// --- MoodInsights Tests ---

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
      { value: 'great', label: 'Great', emoji: '😊', timestamp: Date.now() },
    ];
    render(<MoodInsights history={history} />);
    expect(screen.getByText(/Check in a few more times/)).toBeInTheDocument();
  });

  it('shows insights with multiple entries', () => {
    const history: MoodEntry[] = [
      createMoodEntry('great', 'Great', '😊', 0),
      createMoodEntry('good', 'Good', '🙂', 1),
      createMoodEntry('okay', 'Okay', '😐', 2),
      createMoodEntry('great', 'Great', '😊', 3),
      createMoodEntry('good', 'Good', '🙂', 4),
    ];
    render(<MoodInsights history={history} />);
    expect(screen.getByText('Patterns and observations from your check-in history.')).toBeInTheDocument();
  });

  it('shows consistent check-ins insight for 5+ entries', () => {
    const history: MoodEntry[] = Array.from({ length: 6 }, (_, i) => ({
      value: 'good',
      label: 'Good',
      emoji: '🙂',
      timestamp: Date.now() - i * 86400000,
    }));
    render(<MoodInsights history={history} />);
    expect(screen.getByText('Consistent check-ins')).toBeInTheDocument();
  });

  it('shows most common mood insight', () => {
    const history: MoodEntry[] = [
      createMoodEntry('great', 'Great', '😊', 0),
      createMoodEntry('great', 'Great', '😊', 1),
      createMoodEntry('okay', 'Okay', '😐', 2),
    ];
    render(<MoodInsights history={history} />);
    expect(screen.getByText(/Most common: Great/)).toBeInTheDocument();
  });

  it('shows upward trend when mood improves', () => {
    const history: MoodEntry[] = [
      createMoodEntry('great', 'Great', '😊', 0),
      createMoodEntry('great', 'Great', '😊', 0),
      createMoodEntry('great', 'Great', '😊', 1),
      createMoodEntry('struggling', 'Struggling', '😢', 1),
      createMoodEntry('low', 'Low', '😞', 1),
      createMoodEntry('struggling', 'Struggling', '😢', 2),
    ];
    render(<MoodInsights history={history} />);
    expect(screen.getByText('Upward trend')).toBeInTheDocument();
  });

  it('shows week-over-week comparison panel', () => {
    const history: MoodEntry[] = [
      createMoodEntry('good', 'Good', '🙂', 0),
      createMoodEntry('great', 'Great', '😊', 1),
      createMoodEntry('okay', 'Okay', '😐', 2),
      createMoodEntry('good', 'Good', '🙂', 7),
      createMoodEntry('okay', 'Okay', '😐', 8),
      createMoodEntry('good', 'Good', '🙂', 9),
      createMoodEntry('great', 'Great', '😊', 10),
    ];
    render(<MoodInsights history={history} />);
    expect(screen.getByText('This week vs last week')).toBeInTheDocument();
  });

  it('shows improvement delta in comparison', () => {
    const history: MoodEntry[] = [
      createMoodEntry('great', 'Great', '😊', 0),
      createMoodEntry('great', 'Great', '😊', 1),
      createMoodEntry('struggling', 'Struggling', '😢', 7),
      createMoodEntry('struggling', 'Struggling', '😢', 8),
      createMoodEntry('okay', 'Okay', '😐', 9),
      createMoodEntry('okay', 'Okay', '😐', 10),
    ];
    render(<MoodInsights history={history} />);
    expect(screen.getByText(/better than last week/)).toBeInTheDocument();
  });

  it('shows decline delta in comparison', () => {
    const history: MoodEntry[] = [
      createMoodEntry('struggling', 'Struggling', '😢', 0),
      createMoodEntry('struggling', 'Struggling', '😢', 1),
      createMoodEntry('great', 'Great', '😊', 7),
      createMoodEntry('great', 'Great', '😊', 8),
      createMoodEntry('great', 'Great', '😊', 9),
      createMoodEntry('great', 'Great', '😊', 10),
    ];
    render(<MoodInsights history={history} />);
    expect(screen.getByText(/lower than last week/)).toBeInTheDocument();
  });

  it('shows 7-day bar chart with day labels', () => {
    const history: MoodEntry[] = [
      createMoodEntry('good', 'Good', '🙂', 0),
      createMoodEntry('good', 'Good', '🙂', 1),
    ];
    render(<MoodInsights history={history} />);
    // Day labels: M T W T F S S (T appears for both Tuesday and Thursday)
    expect(screen.getByText('M')).toBeInTheDocument();
    expect(screen.getAllByText('T').length).toBe(2);
    expect(screen.getByText('W')).toBeInTheDocument();
    expect(screen.getByText('F')).toBeInTheDocument();
    expect(screen.getAllByText('S').length).toBe(2);
  });

  it('shows best day of week with sufficient data', () => {
    // Create entries spanning 14+ unique days with a clear Friday pattern
    const history: MoodEntry[] = [];
    for (let i = 0; i < 20; i++) {
      const dayOfWeek = new Date(Date.now() - i * 86400000).getDay();
      // Make Fridays consistently good, other days more mixed
      const value = dayOfWeek === 5 ? 'great' : i % 3 === 0 ? 'great' : 'okay';
      const label = value === 'great' ? 'Great' : 'Okay';
      const emoji = value === 'great' ? '😊' : '😐';
      history.push({ value, label, emoji, timestamp: Date.now() - i * 86400000 });
    }
    render(<MoodInsights history={history} />);
    expect(screen.getByText('Best day of week')).toBeInTheDocument();
    expect(screen.getByText(/Fridays/)).toBeInTheDocument();
  });

  it('shows insufficient data message for best day with few entries', () => {
    const history: MoodEntry[] = [
      createMoodEntry('good', 'Good', '🙂', 0),
      createMoodEntry('good', 'Good', '🙂', 1),
    ];
    render(<MoodInsights history={history} />);
    expect(screen.getByText(/Check back after 2 weeks/)).toBeInTheDocument();
  });

  it('shows mood calendar heatmap', () => {
    const history: MoodEntry[] = [
      createMoodEntry('good', 'Good', '🙂', 0),
      createMoodEntry('okay', 'Okay', '😐', 1),
      createMoodEntry('great', 'Great', '😊', 2),
    ];
    render(<MoodInsights history={history} />);
    expect(screen.getByText(/Mood calendar/)).toBeInTheDocument();
  });

  it('shows Less and More labels for heatmap legend', () => {
    const history: MoodEntry[] = [
      createMoodEntry('good', 'Good', '🙂', 0),
      createMoodEntry('good', 'Good', '🙂', 1),
    ];
    render(<MoodInsights history={history} />);
    expect(screen.getByText('Less')).toBeInTheDocument();
    expect(screen.getByText('More')).toBeInTheDocument();
  });
});

// --- MoodHistory Export Tests ---

describe('MoodHistory', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders empty state when no history', () => {
    render(<MoodHistory history={[]} onClear={() => {}} />);
    expect(screen.getByText(/Your mood history will appear here/)).toBeInTheDocument();
  });

  it('shows mood entries', () => {
    const history: MoodEntry[] = [
      { value: 'great', label: 'Great', emoji: '😊', timestamp: Date.now() },
    ];
    render(<MoodHistory history={history} onClear={() => {}} />);
    expect(screen.getByText('Great')).toBeInTheDocument();
  });

  it('shows Export CSV button when history has multiple entries', () => {
    const history: MoodEntry[] = [
      createMoodEntry('good', 'Good', '🙂', 0),
      createMoodEntry('good', 'Good', '🙂', 1),
    ];
    render(<MoodHistory history={history} onClear={() => {}} />);
    expect(screen.getByText('Export CSV')).toBeInTheDocument();
  });

  it('does not show Export CSV button with single entry', () => {
    const history: MoodEntry[] = [
      { value: 'great', label: 'Great', emoji: '😊', timestamp: Date.now() },
    ];
    render(<MoodHistory history={history} onClear={() => {}} />);
    expect(screen.queryByText('Export CSV')).not.toBeInTheDocument();
  });
});

// --- BreathingExercise Session Tests ---

describe('BreathingExercise', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders the heading', () => {
    render(<BreathingExercise />);
    expect(screen.getByText('Box Breathing')).toBeInTheDocument();
  });

  it('shows ready state initially', () => {
    render(<BreathingExercise />);
    expect(screen.getByText('Ready?')).toBeInTheDocument();
    expect(screen.getByText('Begin')).toBeInTheDocument();
  });

  it('starts exercise when Begin is clicked', () => {
    render(<BreathingExercise />);
    fireEvent.click(screen.getByText('Begin'));
    expect(screen.getByText('Breathe In')).toBeInTheDocument();
  });

  it('shows Stop button during exercise', () => {
    render(<BreathingExercise />);
    fireEvent.click(screen.getByText('Begin'));
    expect(screen.getByText('Stop')).toBeInTheDocument();
  });

  it('shows done state after completing cycles', () => {
    render(<BreathingExercise />);
    fireEvent.click(screen.getByText('Begin'));
    for (let i = 0; i < 36; i++) {
      act(() => { vi.advanceTimersByTime(1000); });
    }
    expect(screen.getByText('Well done')).toBeInTheDocument();
  });

  it('shows Start Again after completion', () => {
    render(<BreathingExercise />);
    fireEvent.click(screen.getByText('Begin'));
    for (let i = 0; i < 36; i++) {
      act(() => { vi.advanceTimersByTime(1000); });
    }
    expect(screen.getByText('Start Again')).toBeInTheDocument();
  });
});

// --- DailySummary Tests ---

describe('DailySummary', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns null when no activity today', () => {
    // Clear any localStorage that tests may have set
    localStorage.clear();
    const { container } = render(<DailySummary />);
    expect(container.firstChild).toBeNull();
  });

  it('shows check-in summary after mood check-in', () => {
    const today = new Date();
    const entries: MoodEntry[] = [
      { value: 'great', label: 'Great', emoji: '😊', timestamp: today.getTime() },
    ];
    localStorage.setItem('handrail-mood-history', JSON.stringify(entries));
    localStorage.setItem('handrail-daily-activity', JSON.stringify({
      date: today.toISOString().split('T')[0],
      moodCheckedIn: true,
      breathingSessions: 0,
      gratitudeEntries: 0,
    }));

    render(<DailySummary />);
    expect(screen.getByText(/You.*ve checked in today/)).toBeInTheDocument();
    expect(screen.getByText('😊 Great')).toBeInTheDocument();
  });

  it('shows gratitude count', () => {
    const today = new Date();
    localStorage.setItem('handrail-daily-activity', JSON.stringify({
      date: today.toISOString().split('T')[0],
      moodCheckedIn: false,
      breathingSessions: 0,
      gratitudeEntries: 2,
    }));
    localStorage.setItem('handrail-gratitude', JSON.stringify([
      { text: 'Friends', timestamp: today.getTime() },
      { text: 'Family', timestamp: today.getTime() },
    ]));

    render(<DailySummary />);
    expect(screen.getByText(/2 gratitude entries/)).toBeInTheDocument();
  });

  it('shows breathing session count', () => {
    const today = new Date();
    localStorage.setItem('handrail-daily-activity', JSON.stringify({
      date: today.toISOString().split('T')[0],
      moodCheckedIn: false,
      breathingSessions: 1,
      gratitudeEntries: 0,
    }));

    render(<DailySummary />);
    expect(screen.getByText(/1 breathing session/)).toBeInTheDocument();
  });

  it('appears when any activity is done today', () => {
    const today = new Date();
    localStorage.setItem('handrail-daily-activity', JSON.stringify({
      date: today.toISOString().split('T')[0],
      moodCheckedIn: true,
      breathingSessions: 0,
      gratitudeEntries: 0,
    }));

    render(<DailySummary />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });
});
