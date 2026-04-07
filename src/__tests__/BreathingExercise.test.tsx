import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { BreathingExercise } from '../components/BreathingExercise';

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

  it('stops exercise when Stop is clicked', () => {
    render(<BreathingExercise />);
    fireEvent.click(screen.getByText('Begin'));
    expect(screen.getByText('Breathe In')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Stop'));
    expect(screen.getByText('Ready?')).toBeInTheDocument();
  });

  it('shows done state after completing cycles', () => {
    render(<BreathingExercise />);
    fireEvent.click(screen.getByText('Begin'));

    // Advance in 1-second increments so React re-renders between ticks
    // 3 cycles of (4 inhale + 4 hold + 4 exhale) = 36 seconds
    for (let i = 0; i < 36; i++) {
      act(() => {
        vi.advanceTimersByTime(1000);
      });
    }

    expect(screen.getByText('Well done')).toBeInTheDocument();
  });

  it('shows Start Again after completion', () => {
    render(<BreathingExercise />);
    fireEvent.click(screen.getByText('Begin'));

    for (let i = 0; i < 36; i++) {
      act(() => {
        vi.advanceTimersByTime(1000);
      });
    }

    expect(screen.getByText('Start Again')).toBeInTheDocument();
  });
});
