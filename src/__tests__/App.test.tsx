import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { App } from '../App';

describe('App', () => {
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

  it('renders all main sections', () => {
    render(<App />);
    expect(screen.getByText('How are you feeling right now?')).toBeInTheDocument();
    expect(screen.getByText('Box Breathing')).toBeInTheDocument();
    expect(screen.getByText('5-4-3-2-1 Grounding')).toBeInTheDocument();
    expect(screen.getByText('Support is Always Available')).toBeInTheDocument();
  });

  it('renders the header with navigation', () => {
    render(<App />);
    expect(screen.getAllByText('Handrail').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('Get Help Now')).toBeInTheDocument();
  });

  it('renders the footer', () => {
    render(<App />);
    expect(screen.getByText(/Not a substitute for professional care/)).toBeInTheDocument();
  });
});
