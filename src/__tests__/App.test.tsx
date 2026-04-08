import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { App } from '../App';

// Mock IntersectionObserver
class MockIntersectionObserver {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
}
window.IntersectionObserver = MockIntersectionObserver as unknown as typeof IntersectionObserver;

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

describe('App', () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders the app title', () => {
    render(<App />);
    expect(screen.getByText('Find Your')).toBeInTheDocument();
    expect(screen.getByText('Footing')).toBeInTheDocument();
  });

  it('renders the skip to main content link', () => {
    render(<App />);
    const skipLink = screen.getByText('Skip to main content');
    expect(skipLink).toBeInTheDocument();
  });

  it('renders the main hero section', () => {
    render(<App />);
    expect(screen.getByText(/A gentle space to check in with yourself/)).toBeInTheDocument();
  });

  it('renders the header with navigation', () => {
    render(<App />);
    expect(screen.getAllByText('Handrail').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('Get Help Now')).toBeInTheDocument();
  });

  it('renders the daily tip', () => {
    render(<App />);
    expect(screen.getByText('Daily Tip')).toBeInTheDocument();
  });

  it('renders the mood check-in section', () => {
    render(<App />);
    expect(screen.getByText('How are you feeling right now?')).toBeInTheDocument();
  });

  it('renders the mood history section', () => {
    render(<App />);
    expect(screen.getByText('Recent Check-ins')).toBeInTheDocument();
  });

  it('renders the wellness checklist', () => {
    render(<App />);
    expect(screen.getByText('Daily Wellness Checklist')).toBeInTheDocument();
  });

  it('renders the quick actions section', () => {
    render(<App />);
    expect(screen.getByText('Check Your Mood')).toBeInTheDocument();
  });

  it('renders a time-based greeting', () => {
    render(<App />);
    const greetings = screen.queryAllByText(/Good (morning|afternoon|evening)/);
    expect(greetings.length).toBeGreaterThanOrEqual(1);
  });

  it('renders dark mode toggle', () => {
    render(<App />);
    const themeButton = screen.getByLabelText(/Switch to/);
    expect(themeButton).toBeInTheDocument();
  });

  it('renders the daily quote in hero', () => {
    render(<App />);
    // Quote attribution should be present
    expect(screen.getByText(/— /)).toBeInTheDocument();
  });
});
