import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { WellnessChecklist } from '../components/WellnessChecklist';

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

describe('WellnessChecklist', () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders the heading', () => {
    render(<WellnessChecklist />);
    expect(screen.getByText('Daily Wellness Checklist')).toBeInTheDocument();
  });

  it('renders the description', () => {
    render(<WellnessChecklist />);
    expect(screen.getByText(/Small steps make a big difference/)).toBeInTheDocument();
  });

  it('renders all five checklist items', () => {
    render(<WellnessChecklist />);
    expect(screen.getByText('Drink a glass of water')).toBeInTheDocument();
    expect(screen.getByText('Move for 5 minutes')).toBeInTheDocument();
    expect(screen.getByText('Take 3 deep breaths')).toBeInTheDocument();
    expect(screen.getByText('Reach out to someone')).toBeInTheDocument();
    expect(screen.getByText('Name one good thing today')).toBeInTheDocument();
  });

  it('renders progress bar showing 0/5 initially', () => {
    render(<WellnessChecklist />);
    expect(screen.getByText('0/5 completed')).toBeInTheDocument();
  });

  it('checks an item when clicked', () => {
    render(<WellnessChecklist />);
    const checkbox = screen.getByRole('checkbox', { name: /Drink a glass of water/ });
    expect(checkbox).toHaveAttribute('aria-checked', 'false');
    fireEvent.click(checkbox);
    expect(checkbox).toHaveAttribute('aria-checked', 'true');
  });

  it('updates progress when an item is checked', () => {
    render(<WellnessChecklist />);
    fireEvent.click(screen.getByRole('checkbox', { name: /Drink a glass of water/ }));
    expect(screen.getByText('1/5 completed')).toBeInTheDocument();
  });

  it('unchecks an item when clicked twice', () => {
    render(<WellnessChecklist />);
    const checkbox = screen.getByRole('checkbox', { name: /Move for 5 minutes/ });
    fireEvent.click(checkbox);
    expect(checkbox).toHaveAttribute('aria-checked', 'true');
    fireEvent.click(checkbox);
    expect(checkbox).toHaveAttribute('aria-checked', 'false');
  });

  it('persists checked items to localStorage', () => {
    render(<WellnessChecklist />);
    fireEvent.click(screen.getByRole('checkbox', { name: /Take 3 deep breaths/ }));
    expect(localStorageMock.setItem).toHaveBeenCalled();
  });

  it('shows completion message when all items are checked', () => {
    render(<WellnessChecklist />);
    const checkboxes = screen.getAllByRole('checkbox');
    checkboxes.forEach(cb => fireEvent.click(cb));
    expect(screen.getByText(/Amazing! You completed all your wellness tasks/)).toBeInTheDocument();
  });

  it('does not show completion message when items remain unchecked', () => {
    render(<WellnessChecklist />);
    expect(screen.queryByText(/Amazing!/)).not.toBeInTheDocument();
  });

  it('renders progress bar with correct aria attributes', () => {
    render(<WellnessChecklist />);
    const progressbar = screen.getByRole('progressbar');
    expect(progressbar).toHaveAttribute('aria-valuenow', '0');
    expect(progressbar).toHaveAttribute('aria-valuemin', '0');
    expect(progressbar).toHaveAttribute('aria-valuemax', '5');
  });
});
