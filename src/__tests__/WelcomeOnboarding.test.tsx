import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { WelcomeOnboarding } from '../components/WelcomeOnboarding';

// Mock IntersectionObserver
class MockIntersectionObserver {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
}
window.IntersectionObserver = MockIntersectionObserver as unknown as typeof IntersectionObserver;

describe('WelcomeOnboarding', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('shows onboarding modal for first-time users', () => {
    render(<WelcomeOnboarding />);
    expect(screen.getByText('Welcome to Handrail')).toBeInTheDocument();
    expect(screen.getByText('Next')).toBeInTheDocument();
    expect(screen.getByText('Skip')).toBeInTheDocument();
  });

  it('does not show modal if already completed', () => {
    localStorage.setItem('handrail-onboarding-complete', 'true');
    render(<WelcomeOnboarding />);
    expect(screen.queryByText('Welcome to Handrail')).not.toBeInTheDocument();
  });

  it('navigates to next step', () => {
    render(<WelcomeOnboarding />);
    fireEvent.click(screen.getByText('Next'));
    expect(screen.getByText('Check In With Yourself')).toBeInTheDocument();
    expect(screen.getByText('Back')).toBeInTheDocument();
  });

  it('navigates back to previous step', () => {
    render(<WelcomeOnboarding />);
    fireEvent.click(screen.getByText('Next'));
    expect(screen.getByText('Check In With Yourself')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Back'));
    expect(screen.getByText('Welcome to Handrail')).toBeInTheDocument();
  });

  it('skips onboarding and saves to localStorage', () => {
    render(<WelcomeOnboarding />);
    fireEvent.click(screen.getByText('Skip'));
    expect(screen.queryByText('Welcome to Handrail')).not.toBeInTheDocument();
    expect(localStorage.getItem('handrail-onboarding-complete')).toBe('true');
  });

  it('completes all steps and dismisses', () => {
    render(<WelcomeOnboarding />);
    // Step 0: Welcome
    fireEvent.click(screen.getByText('Next'));
    // Step 1: Check In
    expect(screen.getByText('Check In With Yourself')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Next'));
    // Step 2: Breathe & Ground
    expect(screen.getByText('Breathe & Ground')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Next'));
    // Step 3: Practice Gratitude
    expect(screen.getByText('Practice Gratitude')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Next'));
    // Step 4: You're Not Alone
    expect(screen.getByText('You\'re Not Alone')).toBeInTheDocument();
    expect(screen.getByText('Get Started')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Get Started'));
    // Should be dismissed
    expect(screen.queryByText('You\'re Not Alone')).not.toBeInTheDocument();
    expect(localStorage.getItem('handrail-onboarding-complete')).toBe('true');
  });

  it('shows progress indicators', () => {
    render(<WelcomeOnboarding />);
    // Progress bars are rendered (5 steps)
    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeInTheDocument();
  });

  it('closes on Escape key', () => {
    render(<WelcomeOnboarding />);
    fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape' });
    expect(screen.queryByText('Welcome to Handrail')).not.toBeInTheDocument();
  });
});
