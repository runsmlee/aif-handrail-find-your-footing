import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { GratitudeJournal } from '../components/GratitudeJournal';

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

describe('GratitudeJournal', () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('renders the heading', () => {
    render(<GratitudeJournal />);
    expect(screen.getByText('Gratitude Journal')).toBeInTheDocument();
  });

  it('renders the description', () => {
    render(<GratitudeJournal />);
    expect(screen.getByText(/Writing down what you're grateful for/)).toBeInTheDocument();
  });

  it('renders the textarea for input', () => {
    render(<GratitudeJournal />);
    expect(screen.getByLabelText('Write what you are grateful for')).toBeInTheDocument();
  });

  it('renders the save button', () => {
    render(<GratitudeJournal />);
    expect(screen.getByText('Save')).toBeInTheDocument();
  });

  it('disables save button when input is empty', () => {
    render(<GratitudeJournal />);
    const saveButton = screen.getByText('Save');
    expect(saveButton).toBeDisabled();
  });

  it('enables save button when text is entered', () => {
    render(<GratitudeJournal />);
    const textarea = screen.getByLabelText('Write what you are grateful for');
    fireEvent.change(textarea, { target: { value: 'My morning coffee' } });
    const saveButton = screen.getByText('Save');
    expect(saveButton).not.toBeDisabled();
  });

  it('saves entry and shows success message', () => {
    render(<GratitudeJournal />);
    const textarea = screen.getByLabelText('Write what you are grateful for');
    fireEvent.change(textarea, { target: { value: 'Sunshine today' } });
    fireEvent.click(screen.getByText('Save'));

    expect(screen.getByText(/Saved!/)).toBeInTheDocument();
    expect(localStorageMock.setItem).toHaveBeenCalled();
  });

  it('clears input after saving', () => {
    render(<GratitudeJournal />);
    const textarea = screen.getByLabelText('Write what you are grateful for');
    fireEvent.change(textarea, { target: { value: 'Good friends' } });
    fireEvent.click(screen.getByText('Save'));

    expect(textarea).toHaveValue('');
  });

  it('renders empty state when no entries', () => {
    render(<GratitudeJournal />);
    expect(screen.getByText(/Your gratitude entries will appear here/)).toBeInTheDocument();
  });

  it('shows prompt text', () => {
    render(<GratitudeJournal />);
    // One of the prompts should be visible
    const prompts = [
      'What made you smile today?',
      'Name someone who helped you recently.',
      'What is something you are looking forward to?',
      'What is a skill or ability you are grateful for?',
      'What is something beautiful you noticed today?',
    ];
    const found = prompts.some(p => screen.queryByText(p) !== null);
    expect(found).toBe(true);
  });

  it('shows past entries after saving', () => {
    render(<GratitudeJournal />);
    const textarea = screen.getByLabelText('Write what you are grateful for');
    fireEvent.change(textarea, { target: { value: 'Fresh air' } });
    fireEvent.click(screen.getByText('Save'));

    // Entry is wrapped in curly quotes (ldquo/rdquo)
    expect(screen.getByText(/\u201CFresh air\u201D/)).toBeInTheDocument();
  });
});
