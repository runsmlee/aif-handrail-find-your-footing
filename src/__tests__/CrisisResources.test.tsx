import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CrisisResources } from '../components/CrisisResources';

describe('CrisisResources', () => {
  it('renders the heading', () => {
    render(<CrisisResources />);
    expect(screen.getByText('Support is Always Available')).toBeInTheDocument();
  });

  it('renders the description', () => {
    render(<CrisisResources />);
    expect(screen.getByText(/If you or someone you know is in crisis/)).toBeInTheDocument();
  });

  it('renders the "you are not alone" badge', () => {
    render(<CrisisResources />);
    expect(screen.getByText('You are not alone')).toBeInTheDocument();
  });

  it('renders 988 Suicide & Crisis Lifeline', () => {
    render(<CrisisResources />);
    expect(screen.getByText('988 Suicide & Crisis Lifeline')).toBeInTheDocument();
    expect(screen.getByText('988')).toBeInTheDocument();
  });

  it('renders Crisis Text Line', () => {
    render(<CrisisResources />);
    expect(screen.getByText('Crisis Text Line')).toBeInTheDocument();
    expect(screen.getByText('Text HOME to 741741')).toBeInTheDocument();
  });

  it('renders SAMHSA National Helpline', () => {
    render(<CrisisResources />);
    expect(screen.getByText('SAMHSA National Helpline')).toBeInTheDocument();
    expect(screen.getByText('1-800-662-4357')).toBeInTheDocument();
  });

  it('renders The Trevor Project', () => {
    render(<CrisisResources />);
    expect(screen.getByText('The Trevor Project')).toBeInTheDocument();
    expect(screen.getByText('1-866-488-7386')).toBeInTheDocument();
  });

  it('renders 24/7 availability for resources', () => {
    render(<CrisisResources />);
    const availability = screen.getAllByText('24/7');
    expect(availability.length).toBeGreaterThanOrEqual(2);
  });

  it('renders emergency disclaimer', () => {
    render(<CrisisResources />);
    expect(screen.getByText(/If you are in immediate danger/)).toBeInTheDocument();
  });

  it('renders the section with correct id for navigation', () => {
    render(<CrisisResources />);
    const section = document.getElementById('crisis');
    expect(section).toBeInTheDocument();
  });

  it('renders all four resource cards', () => {
    render(<CrisisResources />);
    const resourceNames = [
      '988 Suicide & Crisis Lifeline',
      'Crisis Text Line',
      'SAMHSA National Helpline',
      'The Trevor Project',
    ];
    resourceNames.forEach(name => {
      expect(screen.getByText(name)).toBeInTheDocument();
    });
  });
});
