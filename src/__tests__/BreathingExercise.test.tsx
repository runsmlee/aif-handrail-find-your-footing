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
    // Default is 'standard' = 3 cycles
    fireEvent.click(screen.getByText('Begin'));

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

  it('renders duration selector when idle', () => {
    render(<BreathingExercise />);
    expect(screen.getByLabelText('1 min: 2 cycles')).toBeInTheDocument();
    expect(screen.getByLabelText('2 min: 3 cycles')).toBeInTheDocument();
    expect(screen.getByLabelText('4 min: 6 cycles')).toBeInTheDocument();
  });

  it('hides duration selector during exercise', () => {
    render(<BreathingExercise />);
    fireEvent.click(screen.getByText('Begin'));
    expect(screen.queryByLabelText('1 min: 2 cycles')).not.toBeInTheDocument();
  });

  it('can select a different duration', () => {
    render(<BreathingExercise />);
    fireEvent.click(screen.getByLabelText('1 min: 2 cycles'));
    // Now start
    fireEvent.click(screen.getByText('Begin'));
    // 2 cycles of (4 + 4 + 4) = 24 seconds
    for (let i = 0; i < 24; i++) {
      act(() => {
        vi.advanceTimersByTime(1000);
      });
    }
    expect(screen.getByText('Well done')).toBeInTheDocument();
  });
});
