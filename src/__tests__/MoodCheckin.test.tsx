import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { MoodCheckin } from '../components/MoodCheckin';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] ?? null),
    setItem: vi.fn((key: string, value: string) => { store[key] = value; }),
    removeItem: vi.fn((key: string) => { delete store[key]; }),
    clear: vi.fn(() => { store = {}; }),
  };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('MoodCheckin', () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders the heading', () => {
    render(<MoodCheckin />);
    expect(screen.getByText('How are you feeling right now?')).toBeInTheDocument();
  });

  it('renders all five mood options', () => {
    render(<MoodCheckin />);
    expect(screen.getByLabelText('Great: Feeling wonderful')).toBeInTheDocument();
    expect(screen.getByLabelText('Good: Doing alright')).toBeInTheDocument();
    expect(screen.getByLabelText('Okay: Somewhere in the middle')).toBeInTheDocument();
    expect(screen.getByLabelText('Low: Feeling a bit down')).toBeInTheDocument();
    expect(screen.getByLabelText('Struggling: Having a hard time')).toBeInTheDocument();
  });

  it('shows confirmation after selecting a mood', () => {
    render(<MoodCheckin />);
    fireEvent.click(screen.getByLabelText('Good: Doing alright'));
    expect(screen.getByText('Thank you for checking in')).toBeInTheDocument();
  });

  it('allows checking in again after confirmation', () => {
    render(<MoodCheckin />);
    fireEvent.click(screen.getByLabelText('Great: Feeling wonderful'));
    expect(screen.getByText('Thank you for checking in')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Check in again'));
    expect(screen.getByText('How are you feeling right now?')).toBeInTheDocument();
  });

  it('calls onMoodSelect callback when mood is selected', () => {
    const handler = vi.fn();
    render(<MoodCheckin onMoodSelect={handler} />);
    fireEvent.click(screen.getByLabelText('Okay: Somewhere in the middle'));
    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler).toHaveBeenCalledWith(
      expect.objectContaining({ value: 'okay', label: 'Okay' }),
    );
  });

  it('renders privacy notice', () => {
    render(<MoodCheckin />);
    expect(screen.getByText(/Your check-in stays private/)).toBeInTheDocument();
  });

  it('renders the mood history section', () => {
    render(<MoodCheckin />);
    expect(screen.getByText('Recent Check-ins')).toBeInTheDocument();
  });

  it('shows empty history state initially', () => {
    render(<MoodCheckin />);
    expect(screen.getByText(/Your mood history will appear here/)).toBeInTheDocument();
  });

  it('persists mood to localStorage', () => {
    render(<MoodCheckin />);
    fireEvent.click(screen.getByLabelText('Great: Feeling wonderful'));
    expect(localStorageMock.setItem).toHaveBeenCalled();
  });

  it('uses sharedAddEntry when provided instead of internal hook', () => {
    const sharedAddEntry = vi.fn();
    const sharedHistory: Array<{ value: string; label: string; emoji: string; timestamp: number }> = [];
    render(
      <MoodCheckin
        sharedAddEntry={sharedAddEntry}
        sharedHistory={sharedHistory}
        sharedClearHistory={vi.fn()}
      />
    );
    fireEvent.click(screen.getByLabelText('Great: Feeling wonderful'));
    expect(sharedAddEntry).toHaveBeenCalledTimes(1);
    expect(sharedAddEntry).toHaveBeenCalledWith(
      expect.objectContaining({ value: 'great', label: 'Great' }),
    );
  });

  it('calls onMoodCheckedIn when mood is selected with shared state', () => {
    const onMoodCheckedIn = vi.fn();
    const sharedAddEntry = vi.fn();
    const sharedHistory: Array<{ value: string; label: string; emoji: string; timestamp: number }> = [];
    render(
      <MoodCheckin
        onMoodCheckedIn={onMoodCheckedIn}
        sharedAddEntry={sharedAddEntry}
        sharedHistory={sharedHistory}
        sharedClearHistory={vi.fn()}
      />
    );
    fireEvent.click(screen.getByLabelText('Good: Doing alright'));
    expect(onMoodCheckedIn).toHaveBeenCalledTimes(1);
    expect(sharedAddEntry).toHaveBeenCalledTimes(1);
  });

  it('displays shared history entries when provided', () => {
    const sharedHistory = [
      { value: 'okay', label: 'Okay', emoji: '😐', timestamp: Date.now() - 3600000 },
    ];
    render(
      <MoodCheckin
        sharedAddEntry={vi.fn()}
        sharedHistory={sharedHistory}
        sharedClearHistory={vi.fn()}
      />
    );
    // The history entry should render with the label in the list
    const historySection = screen.getByRole('list', { name: 'Recent mood entries' });
    expect(historySection).toBeInTheDocument();
    // The entry should show "Okay" in the history
    expect(within(historySection).getByText('Okay')).toBeInTheDocument();
  });
});
