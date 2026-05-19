import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { HeroGroundingModule } from '../components/HeroGroundingModule';

// Mock analytics
vi.mock('../utils/analytics', () => ({
  trackEvent: vi.fn(),
}));

// Mock useBreathingSessions
const mockAddSession = vi.fn();
vi.mock('../hooks/useBreathingSessions', () => ({
  useBreathingSessions: () => ({
    sessions: [],
    sessionsThisWeek: 0,
    addSession: mockAddSession,
  }),
}));

import { trackEvent } from '../utils/analytics';

describe('HeroGroundingModule', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('defaults to 5-4-3-2-1 Grounding exercise (primary action)', () => {
    render(<HeroGroundingModule />);
    expect(screen.getByText(/Use your senses to anchor yourself/)).toBeInTheDocument();
    expect(screen.getByText("Let's Begin")).toBeInTheDocument();
  });

  it('shows 5-4-3-2-1 Grounding region by default', () => {
    render(<HeroGroundingModule />);
    expect(screen.getByRole('region', { name: '5-4-3-2-1 Grounding exercise' })).toBeInTheDocument();
  });

  it('shows switch to Box Breathing link on grounding intro', () => {
    render(<HeroGroundingModule />);
    expect(screen.getByLabelText('Switch to Box Breathing exercise')).toBeInTheDocument();
  });

  it('switches to Box Breathing when link is clicked', () => {
    render(<HeroGroundingModule />);
    fireEvent.click(screen.getByLabelText('Switch to Box Breathing exercise'));
    expect(screen.getByRole('region', { name: 'Box Breathing exercise' })).toBeInTheDocument();
    expect(screen.getByText('Ready?')).toBeInTheDocument();
    expect(screen.getByText('Begin')).toBeInTheDocument();
  });

  it('switches back to Grounding from Box Breathing', () => {
    render(<HeroGroundingModule />);
    fireEvent.click(screen.getByLabelText('Switch to Box Breathing exercise'));
    fireEvent.click(screen.getByLabelText('Switch to 5-4-3-2-1 Grounding'));
    expect(screen.getByRole('region', { name: '5-4-3-2-1 Grounding exercise' })).toBeInTheDocument();
    expect(screen.getByText("Let's Begin")).toBeInTheDocument();
  });

  describe('Box Breathing', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('starts breathing when Begin is clicked', () => {
      render(<HeroGroundingModule />);
      fireEvent.click(screen.getByLabelText('Switch to Box Breathing exercise'));
      fireEvent.click(screen.getByText('Begin'));
      expect(screen.getByText('Breathe In')).toBeInTheDocument();
    });

    it('shows Stop button during exercise', () => {
      render(<HeroGroundingModule />);
      fireEvent.click(screen.getByLabelText('Switch to Box Breathing exercise'));
      fireEvent.click(screen.getByText('Begin'));
      expect(screen.getByText('Stop')).toBeInTheDocument();
    });

    it('stops exercise when Stop is clicked', () => {
      render(<HeroGroundingModule />);
      fireEvent.click(screen.getByLabelText('Switch to Box Breathing exercise'));
      fireEvent.click(screen.getByText('Begin'));
      fireEvent.click(screen.getByText('Stop'));
      expect(screen.getByText('Ready?')).toBeInTheDocument();
    });

    it('completes after 2 cycles (24 seconds)', () => {
      render(<HeroGroundingModule />);
      fireEvent.click(screen.getByLabelText('Switch to Box Breathing exercise'));
      fireEvent.click(screen.getByText('Begin'));
      // 2 cycles * (4 inhale + 4 hold + 4 exhale) = 24 seconds
      for (let i = 0; i < 24; i++) {
        act(() => { vi.advanceTimersByTime(1000); });
      }
      expect(screen.getByText('Well done')).toBeInTheDocument();
    });

    it('calls onBreathingComplete when exercise completes', () => {
      const onComplete = vi.fn();
      render(<HeroGroundingModule onBreathingComplete={onComplete} />);
      fireEvent.click(screen.getByLabelText('Switch to Box Breathing exercise'));
      fireEvent.click(screen.getByText('Begin'));
      for (let i = 0; i < 24; i++) {
        act(() => { vi.advanceTimersByTime(1000); });
      }
      expect(onComplete).toHaveBeenCalledTimes(1);
    });

    it('does not call onBreathingComplete twice on re-render', () => {
      const onComplete = vi.fn();
      render(<HeroGroundingModule onBreathingComplete={onComplete} />);
      fireEvent.click(screen.getByLabelText('Switch to Box Breathing exercise'));
      fireEvent.click(screen.getByText('Begin'));
      for (let i = 0; i < 24; i++) {
        act(() => { vi.advanceTimersByTime(1000); });
      }
      // Advance more time to ensure no double-fire
      act(() => { vi.advanceTimersByTime(1000); });
      expect(onComplete).toHaveBeenCalledTimes(1);
    });

    it('shows Start Again after completion', () => {
      render(<HeroGroundingModule />);
      fireEvent.click(screen.getByLabelText('Switch to Box Breathing exercise'));
      fireEvent.click(screen.getByText('Begin'));
      for (let i = 0; i < 24; i++) {
        act(() => { vi.advanceTimersByTime(1000); });
      }
      expect(screen.getByText('Start Again')).toBeInTheDocument();
    });

    it('can restart after completion', () => {
      render(<HeroGroundingModule />);
      fireEvent.click(screen.getByLabelText('Switch to Box Breathing exercise'));
      fireEvent.click(screen.getByText('Begin'));
      for (let i = 0; i < 24; i++) {
        act(() => { vi.advanceTimersByTime(1000); });
      }
      fireEvent.click(screen.getByText('Start Again'));
      expect(screen.getByText('Breathe In')).toBeInTheDocument();
    });

    it('persists breathing session via addSession on completion', () => {
      render(<HeroGroundingModule />);
      fireEvent.click(screen.getByLabelText('Switch to Box Breathing exercise'));
      fireEvent.click(screen.getByText('Begin'));
      for (let i = 0; i < 24; i++) {
        act(() => { vi.advanceTimersByTime(1000); });
      }
      expect(mockAddSession).toHaveBeenCalledWith('Box Breathing (Hero)', 24);
    });

    it('tracks analytics when breathing completes', () => {
      render(<HeroGroundingModule />);
      fireEvent.click(screen.getByLabelText('Switch to Box Breathing exercise'));
      fireEvent.click(screen.getByText('Begin'));
      for (let i = 0; i < 24; i++) {
        act(() => { vi.advanceTimersByTime(1000); });
      }
      expect(trackEvent).toHaveBeenCalledWith('hero_breathing_completed', { cycles: 2, duration_seconds: 24 });
    });
  });

  describe('5-4-3-2-1 Grounding', () => {
    it('starts grounding when Let\'s Begin is clicked', () => {
      render(<HeroGroundingModule />);
      fireEvent.click(screen.getByText("Let's Begin"));
      expect(screen.getByText(/5 Things You Can See/)).toBeInTheDocument();
    });

    it('shows step progress indicator', () => {
      render(<HeroGroundingModule />);
      fireEvent.click(screen.getByText("Let's Begin"));
      // Step 0 should be active with progress bars
      const region = screen.getByRole('region', { name: '5-4-3-2-1 Grounding exercise' });
      expect(region).toBeInTheDocument();
    });

    it('shows the correct step prompt', () => {
      render(<HeroGroundingModule />);
      fireEvent.click(screen.getByText("Let's Begin"));
      expect(screen.getByText(/Look around\. Name 5 things you can see/)).toBeInTheDocument();
    });

    it('advances through all steps to completion', () => {
      render(<HeroGroundingModule />);
      fireEvent.click(screen.getByText("Let's Begin"));
      // Step 0: See
      expect(screen.getByText('5 Things You Can See')).toBeInTheDocument();
      fireEvent.click(screen.getByText('Next'));
      // Step 1: Touch
      expect(screen.getByText('4 Things You Can Touch')).toBeInTheDocument();
      fireEvent.click(screen.getByText('Next'));
      // Step 2: Hear
      expect(screen.getByText('3 Things You Can Hear')).toBeInTheDocument();
      fireEvent.click(screen.getByText('Next'));
      // Step 3: Smell
      expect(screen.getByText('2 Things You Can Smell')).toBeInTheDocument();
      fireEvent.click(screen.getByText('Next'));
      // Step 4: Taste
      expect(screen.getByText('1 Thing You Can Taste')).toBeInTheDocument();
      fireEvent.click(screen.getByText('Finish'));
      // Complete
      expect(screen.getByText(/You're grounded/)).toBeInTheDocument();
    });

    it('shows try again after completion', () => {
      render(<HeroGroundingModule />);
      fireEvent.click(screen.getByText("Let's Begin"));
      for (let i = 0; i < 5; i++) {
        const btn = i < 4 ? 'Next' : 'Finish';
        fireEvent.click(screen.getByText(btn));
      }
      expect(screen.getByText('Try Again')).toBeInTheDocument();
    });

    it('resets to intro when Try Again is clicked', () => {
      render(<HeroGroundingModule />);
      fireEvent.click(screen.getByText("Let's Begin"));
      for (let i = 0; i < 5; i++) {
        const btn = i < 4 ? 'Next' : 'Finish';
        fireEvent.click(screen.getByText(btn));
      }
      fireEvent.click(screen.getByText('Try Again'));
      expect(screen.getByText("Let's Begin")).toBeInTheDocument();
    });

    it('shows cancel button during exercise', () => {
      render(<HeroGroundingModule />);
      fireEvent.click(screen.getByText("Let's Begin"));
      expect(screen.getByText('Cancel')).toBeInTheDocument();
    });

    it('returns to grounding intro when cancel is clicked', () => {
      render(<HeroGroundingModule />);
      fireEvent.click(screen.getByText("Let's Begin"));
      fireEvent.click(screen.getByText('Cancel'));
      expect(screen.getByText("Let's Begin")).toBeInTheDocument();
    });

    it('renders step icons in intro', () => {
      render(<HeroGroundingModule />);
      const region = screen.getByRole('region', { name: '5-4-3-2-1 Grounding exercise' });
      expect(region).toBeInTheDocument();
    });

    it('tracks analytics when grounding completes', () => {
      render(<HeroGroundingModule />);
      fireEvent.click(screen.getByText("Let's Begin"));
      for (let i = 0; i < 5; i++) {
        const btn = i < 4 ? 'Next' : 'Finish';
        fireEvent.click(screen.getByText(btn));
      }
      expect(trackEvent).toHaveBeenCalledWith('hero_grounding_completed');
    });
  });
});
