import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DailyProgress } from '../components/DailyProgress';

describe('DailyProgress', () => {
  it('renders the heading', () => {
    render(<DailyProgress moodCheckedIn={false} checklistProgress={0} checklistTotal={5} breathingDone={false} mindfulnessDone={false} gratitudeDone={false} />);
    expect(screen.getByText("Today's Progress")).toBeInTheDocument();
  });

  it('renders 0/5 when nothing is completed', () => {
    render(<DailyProgress moodCheckedIn={false} checklistProgress={0} checklistTotal={5} breathingDone={false} mindfulnessDone={false} gratitudeDone={false} />);
    // Both the overall counter and checklist label contain 0/5
    const matches = screen.getAllByText('0/5');
    expect(matches.length).toBeGreaterThanOrEqual(1);
  });

  it('renders 5/5 when everything is completed', () => {
    render(<DailyProgress moodCheckedIn={true} checklistProgress={5} checklistTotal={5} breathingDone={true} mindfulnessDone={true} gratitudeDone={true} />);
    // Both the overall counter and checklist label contain 5/5
    const matches = screen.getAllByText('5/5');
    expect(matches.length).toBeGreaterThanOrEqual(1);
  });

  it('renders encouragement for no activity', () => {
    render(<DailyProgress moodCheckedIn={false} checklistProgress={0} checklistTotal={5} breathingDone={false} mindfulnessDone={false} gratitudeDone={false} />);
    expect(screen.getByText('Start your wellness journey for today.')).toBeInTheDocument();
  });

  it('renders encouragement for partial activity', () => {
    render(<DailyProgress moodCheckedIn={true} checklistProgress={0} checklistTotal={5} breathingDone={false} mindfulnessDone={false} gratitudeDone={false} />);
    expect(screen.getByText('Great start! Keep going.')).toBeInTheDocument();
  });

  it('renders encouragement for halfway completion', () => {
    render(<DailyProgress moodCheckedIn={true} checklistProgress={0} checklistTotal={5} breathingDone={false} mindfulnessDone={true} gratitudeDone={false} />);
    expect(screen.getByText("You're halfway there!")).toBeInTheDocument();
  });

  it('renders celebration when all activities are complete', () => {
    render(<DailyProgress moodCheckedIn={true} checklistProgress={5} checklistTotal={5} breathingDone={true} mindfulnessDone={true} gratitudeDone={true} />);
    expect(screen.getByText('Amazing! You completed all activities today.')).toBeInTheDocument();
  });

  it('renders progress bar with correct aria attributes', () => {
    render(<DailyProgress moodCheckedIn={true} checklistProgress={2} checklistTotal={5} breathingDone={false} mindfulnessDone={false} gratitudeDone={false} />);
    const progressbar = screen.getByRole('progressbar');
    expect(progressbar).toHaveAttribute('aria-valuenow', '1');
    expect(progressbar).toHaveAttribute('aria-valuemin', '0');
    expect(progressbar).toHaveAttribute('aria-valuemax', '5');
  });

  it('renders completion status for each activity', () => {
    render(<DailyProgress moodCheckedIn={true} checklistProgress={5} checklistTotal={5} breathingDone={false} mindfulnessDone={false} gratitudeDone={false} />);
    const listitems = screen.getAllByRole('listitem');
    expect(listitems).toHaveLength(5);
  });

  it('renders encouragement for 3 of 5 completed', () => {
    render(<DailyProgress moodCheckedIn={true} checklistProgress={5} checklistTotal={5} breathingDone={true} mindfulnessDone={false} gratitudeDone={false} />);
    expect(screen.getByText('Almost done! Just a bit more.')).toBeInTheDocument();
  });

  it('shows mindfulness as completed when done', () => {
    render(<DailyProgress moodCheckedIn={false} checklistProgress={0} checklistTotal={5} breathingDone={false} mindfulnessDone={true} gratitudeDone={false} />);
    expect(screen.getByText('1/5')).toBeInTheDocument();
    expect(screen.getByText('Great start! Keep going.')).toBeInTheDocument();
  });
});
