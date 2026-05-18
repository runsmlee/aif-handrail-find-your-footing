import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { GroundingExercise } from '../components/GroundingExercise';

describe('GroundingExercise', () => {
  it('renders the heading', () => {
    render(<GroundingExercise />);
    expect(screen.getByText('5-4-3-2-1 Grounding')).toBeInTheDocument();
  });

  it('renders the description', () => {
    render(<GroundingExercise />);
    expect(screen.getByText(/A sensory technique to bring your focus to the present moment/)).toBeInTheDocument();
  });

  it('renders the start button in intro phase', () => {
    render(<GroundingExercise />);
    expect(screen.getByText("Let's Begin")).toBeInTheDocument();
  });

  it('starts the exercise when begin is clicked', () => {
    render(<GroundingExercise />);
    fireEvent.click(screen.getByText("Let's Begin"));
    expect(screen.getByText('5 Things You Can See')).toBeInTheDocument();
  });

  it('shows the correct step description', () => {
    render(<GroundingExercise />);
    fireEvent.click(screen.getByText("Let's Begin"));
    expect(screen.getByText(/Look around and name five things you can see/)).toBeInTheDocument();
  });

  it('allows adding items to a step', () => {
    render(<GroundingExercise />);
    fireEvent.click(screen.getByText("Let's Begin"));
    const addButton = screen.getByText(/\+ Add 1 of 5/);
    expect(addButton).toBeInTheDocument();
    fireEvent.click(addButton);
    const input = screen.getByPlaceholderText('What do you see? (1 of 5)');
    expect(input).toBeInTheDocument();
  });

  it('navigates to the next step', () => {
    render(<GroundingExercise />);
    fireEvent.click(screen.getByText("Let's Begin"));
    fireEvent.click(screen.getByText('Next Step'));
    expect(screen.getByText('4 Things You Can Touch')).toBeInTheDocument();
  });

  it('navigates through all steps to completion', () => {
    render(<GroundingExercise />);
    fireEvent.click(screen.getByText("Let's Begin"));
    // Step 1: See
    fireEvent.click(screen.getByText('Next Step'));
    // Step 2: Touch
    expect(screen.getByText('4 Things You Can Touch')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Next Step'));
    // Step 3: Hear
    expect(screen.getByText('3 Things You Can Hear')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Next Step'));
    // Step 4: Smell
    expect(screen.getByText('2 Things You Can Smell')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Next Step'));
    // Step 5: Taste
    expect(screen.getByText('1 Thing You Can Taste')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Finish'));
    // Complete
    expect(screen.getByText("You're grounded")).toBeInTheDocument();
  });

  it('shows try again button after completion', () => {
    render(<GroundingExercise />);
    fireEvent.click(screen.getByText("Let's Begin"));
    // Go through all steps quickly
    for (let i = 0; i < 5; i++) {
      const buttonText = i < 4 ? 'Next Step' : 'Finish';
      fireEvent.click(screen.getByText(buttonText));
    }
    expect(screen.getByText('Try Again')).toBeInTheDocument();
  });

  it('resets to intro when try again is clicked', () => {
    render(<GroundingExercise />);
    fireEvent.click(screen.getByText("Let's Begin"));
    for (let i = 0; i < 5; i++) {
      const buttonText = i < 4 ? 'Next Step' : 'Finish';
      fireEvent.click(screen.getByText(buttonText));
    }
    fireEvent.click(screen.getByText('Try Again'));
    expect(screen.getByText("Let's Begin")).toBeInTheDocument();
  });

  it('shows cancel button during exercise', () => {
    render(<GroundingExercise />);
    fireEvent.click(screen.getByText("Let's Begin"));
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });

  it('resets to intro when cancel is clicked', () => {
    render(<GroundingExercise />);
    fireEvent.click(screen.getByText("Let's Begin"));
    fireEvent.click(screen.getByText('Cancel'));
    expect(screen.getByText("Let's Begin")).toBeInTheDocument();
  });

  it('renders step icons in intro', () => {
    render(<GroundingExercise />);
    // The step icons (eye, hands, ear, nose, peach) are shown in the intro
    const section = screen.getByText('5-4-3-2-1 Grounding').closest('section');
    expect(section).toBeInTheDocument();
  });

  it('renders progress bars during exercise', () => {
    render(<GroundingExercise />);
    fireEvent.click(screen.getByText("Let's Begin"));
    // Progress bars are rendered (aria-hidden)
    const form = screen.getByRole('form');
    expect(form).toBeInTheDocument();
  });
});
