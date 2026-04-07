import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
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
});
