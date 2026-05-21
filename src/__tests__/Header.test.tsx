import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Header } from '../components/Header';

// Mock analytics
vi.mock('../utils/analytics', () => ({
  trackEvent: vi.fn(),
}));

import { trackEvent } from '../utils/analytics';

describe('Header', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the brand name', () => {
    render(<Header />);
    expect(screen.getByText('Handrail')).toBeInTheDocument();
  });

  it('renders the Get Help Now crisis CTA', () => {
    render(<Header />);
    expect(screen.getByText('Get Help Now')).toBeInTheDocument();
  });

  it('renders desktop navigation items', () => {
    render(<Header />);
    expect(screen.getByText('Check In')).toBeInTheDocument();
    expect(screen.getByText('Meditate')).toBeInTheDocument();
    expect(screen.getByText('Ground Yourself')).toBeInTheDocument();
    expect(screen.getByText('Support')).toBeInTheDocument();
  });

  it('renders dark mode toggle with accessible label', () => {
    render(<Header theme="light" />);
    const toggle = screen.getByLabelText('Switch to dark mode');
    expect(toggle).toBeInTheDocument();
  });

  it('renders light mode toggle when in dark mode', () => {
    render(<Header theme="dark" />);
    const toggle = screen.getByLabelText('Switch to light mode');
    expect(toggle).toBeInTheDocument();
  });

  it('calls onToggleTheme when toggle is clicked', () => {
    const onToggleTheme = vi.fn();
    render(<Header theme="light" onToggleTheme={onToggleTheme} />);
    fireEvent.click(screen.getByLabelText('Switch to dark mode'));
    expect(onToggleTheme).toHaveBeenCalledTimes(1);
  });

  it('highlights active section in navigation', () => {
    render(<Header activeSection="mood" />);
    const activeLink = screen.getByText('Check In');
    expect(activeLink).toHaveAttribute('aria-current', 'true');
  });

  it('does not highlight inactive sections', () => {
    render(<Header activeSection="mood" />);
    const inactiveLink = screen.getByText('Meditate');
    expect(inactiveLink).not.toHaveAttribute('aria-current');
  });

  it('renders mobile menu button on small screens', () => {
    render(<Header />);
    const menuButton = screen.getByLabelText('Open menu');
    expect(menuButton).toBeInTheDocument();
  });

  it('opens mobile menu when hamburger is clicked', () => {
    render(<Header />);
    fireEvent.click(screen.getByLabelText('Open menu'));
    expect(screen.getByLabelText('Close menu')).toBeInTheDocument();
    expect(screen.getByLabelText('Mobile navigation')).toBeInTheDocument();
  });

  it('closes mobile menu when close button is clicked', () => {
    render(<Header />);
    fireEvent.click(screen.getByLabelText('Open menu'));
    fireEvent.click(screen.getByLabelText('Close menu'));
    expect(screen.getByLabelText('Open menu')).toBeInTheDocument();
  });

  it('renders with banner role', () => {
    render(<Header />);
    expect(screen.getByRole('banner')).toBeInTheDocument();
  });

  it('logo link has accessible label', () => {
    render(<Header />);
    const logoLink = screen.getByLabelText('Handrail home');
    expect(logoLink).toBeInTheDocument();
    expect(logoLink).toHaveAttribute('href', '/');
  });

  it('desktop navigation has accessible label', () => {
    render(<Header />);
    expect(screen.getByLabelText('Main navigation')).toBeInTheDocument();
  });

  it('Get Help Now links to crisis section', () => {
    render(<Header />);
    const crisisLinks = screen.getAllByText('Get Help Now');
    // There are desktop and mobile versions
    for (const link of crisisLinks) {
      expect(link.closest('a')).toHaveAttribute('href', '#crisis');
    }
  });

  it('tracks analytics when theme is toggled', () => {
    const onToggleTheme = vi.fn();
    render(<Header theme="light" onToggleTheme={onToggleTheme} />);
    fireEvent.click(screen.getByLabelText('Switch to dark mode'));
    expect(trackEvent).toHaveBeenCalledWith('theme_toggled', { theme: 'dark' });
  });

  it('tracks analytics when logo is clicked', () => {
    render(<Header />);
    const logoLink = screen.getByLabelText('Handrail home');
    fireEvent.click(logoLink);
    expect(trackEvent).toHaveBeenCalledWith('nav_clicked', { target: 'logo' });
  });
});
