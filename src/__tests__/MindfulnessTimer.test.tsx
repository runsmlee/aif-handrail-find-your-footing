import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { MindfulnessTimer } from '../components/MindfulnessTimer';

// Mock IntersectionObserver
class MockIntersectionObserver {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
}
window.IntersectionObserver = MockIntersectionObserver as unknown as typeof IntersectionObserver;

describe('MindfulnessTimer', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders the mindfulness timer section', () => {
    render(<MindfulnessTimer />);
    expect(screen.getByText('Mindfulness Timer')).toBeInTheDocument();
  });

  it('renders duration options', () => {
    render(<MindfulnessTimer />);
    expect(screen.getByText('Quick pause')).toBeInTheDocument();
    expect(screen.getByText('Short session')).toBeInTheDocument();
    expect(screen.getByText('Standard')).toBeInTheDocument();
    expect(screen.getByText('Deep session')).toBeInTheDocument();
  });

  it('renders the begin button', () => {
    render(<MindfulnessTimer />);
    expect(screen.getByText('Begin')).toBeInTheDocument();
  });

  it('starts the timer when begin is clicked', () => {
    render(<MindfulnessTimer />);
    const beginButton = screen.getByText('Begin');
    fireEvent.click(beginButton);
    expect(screen.getByText('Pause')).toBeInTheDocument();
    expect(screen.getByText('Reset')).toBeInTheDocument();
  });

  it('pauses the timer when pause is clicked', () => {
    render(<MindfulnessTimer />);
    fireEvent.click(screen.getByText('Begin'));
    fireEvent.click(screen.getByText('Pause'));
    expect(screen.getByText('Resume')).toBeInTheDocument();
    expect(screen.getByText('Paused')).toBeInTheDocument();
  });

  it('resumes the timer when resume is clicked', () => {
    render(<MindfulnessTimer />);
    fireEvent.click(screen.getByText('Begin'));
    fireEvent.click(screen.getByText('Pause'));
    fireEvent.click(screen.getByText('Resume'));
    expect(screen.getByText('Pause')).toBeInTheDocument();
    expect(screen.queryByText('Paused')).not.toBeInTheDocument();
  });

  it('resets to idle when reset is clicked', () => {
    render(<MindfulnessTimer />);
    fireEvent.click(screen.getByText('Begin'));
    fireEvent.click(screen.getByText('Reset'));
    expect(screen.getByText('Begin')).toBeInTheDocument();
  });

  it('selects a different duration', () => {
    render(<MindfulnessTimer />);
    // Click 1 min option
    const oneMinOption = screen.getByLabelText('1 min: Quick pause');
    fireEvent.click(oneMinOption);
    expect(oneMinOption).toHaveAttribute('aria-checked', 'true');
  });

  it('counts down and shows completion', () => {
    render(<MindfulnessTimer />);
    // Select 1 min duration
    fireEvent.click(screen.getByLabelText('1 min: Quick pause'));
    fireEvent.click(screen.getByText('Begin'));
    // Advance timer by 60 seconds
    act(() => {
      vi.advanceTimersByTime(61000);
    });
    expect(screen.getByText('Session complete')).toBeInTheDocument();
    expect(screen.getByText('Start Again')).toBeInTheDocument();
  });
});
