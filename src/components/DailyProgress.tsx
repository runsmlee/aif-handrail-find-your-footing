import { useMemo } from 'react';

interface ProgressItem {
  id: string;
  label: string;
  completed: boolean;
  icon: string;
}

interface DailyProgressProps {
  moodCheckedIn: boolean;
  checklistProgress: number;
  checklistTotal: number;
  breathingDone: boolean;
  gratitudeDone: boolean;
}

export function DailyProgress({
  moodCheckedIn,
  checklistProgress,
  checklistTotal,
  breathingDone,
  gratitudeDone,
}: DailyProgressProps) {
  const items: ProgressItem[] = useMemo(() => [
    { id: 'mood', label: 'Check In', completed: moodCheckedIn, icon: '\u{1F4CB}' },
    { id: 'checklist', label: `Tasks ${checklistProgress}/${checklistTotal}`, completed: checklistProgress === checklistTotal && checklistTotal > 0, icon: '\u{2705}' },
    { id: 'breathe', label: 'Breathe', completed: breathingDone, icon: '\u{1F30A}' },
    { id: 'gratitude', label: 'Gratitude', completed: gratitudeDone, icon: '\u{1F64F}' },
  ], [moodCheckedIn, checklistProgress, checklistTotal, breathingDone, gratitudeDone]);

  const completedCount = items.filter(i => i.completed).length;
  const totalItems = items.length;
  const progressPercent = totalItems > 0 ? (completedCount / totalItems) * 100 : 0;

  const isAllComplete = completedCount === totalItems;

  const encouragementMessage = useMemo((): string => {
    if (isAllComplete) return 'Amazing! You completed all activities today.';
    if (completedCount === 0) return 'Start your wellness journey for today.';
    if (completedCount === 1) return 'Great start! Keep going.';
    if (completedCount === 2) return 'You\'re halfway there!';
    return 'Almost done! Just a bit more.';
  }, [completedCount, isAllComplete]);

  return (
    <section
      className="py-6 sm:py-8 bg-white dark:bg-slate-800 border-b border-slate-100 dark:border-slate-700"
      aria-labelledby="daily-progress-heading"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
          {/* Heading */}
          <div className="flex items-center gap-3 sm:min-w-[180px]">
            <h2 id="daily-progress-heading" className="text-sm font-semibold text-slate-900 dark:text-white">
              Today&apos;s Progress
            </h2>
            <span className="text-xs text-slate-400 dark:text-slate-500">
              {completedCount}/{totalItems}
            </span>
          </div>

          {/* Progress items */}
          <div className="flex-1">
            <div className="flex items-center gap-3 sm:gap-4" role="list" aria-label="Today's wellness activities">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-1.5"
                  role="listitem"
                  aria-label={`${item.label}: ${item.completed ? 'completed' : 'not completed'}`}
                >
                  <span
                    className={`text-base transition-transform duration-200 ${
                      item.completed ? 'scale-110' : 'opacity-40 grayscale'
                    }`}
                    aria-hidden="true"
                  >
                    {item.icon}
                  </span>
                  <span
                    className={`text-xs font-medium transition-colors ${
                      item.completed
                        ? 'text-sage-700 dark:text-sage-300'
                        : 'text-slate-400 dark:text-slate-500'
                    }`}
                  >
                    <span className="hidden sm:inline">{item.label}</span>
                    <span className="sm:hidden">{item.id === 'checklist' ? `${checklistProgress}/${checklistTotal}` : item.id.charAt(0).toUpperCase() + item.id.slice(1)}</span>
                  </span>
                  {item.completed && (
                    <svg
                      className="w-3.5 h-3.5 text-sage-500 dark:text-sage-400"
                      viewBox="0 0 16 16"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8 15A7 7 0 108 1a7 7 0 000 14zm3.844-8.791a1 1 0 00-1.414-1.414L7 8.586 5.707 7.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4.137-4.5z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>
              ))}
            </div>

            {/* Progress bar */}
            <div
              className="mt-3"
              role="progressbar"
              aria-valuenow={completedCount}
              aria-valuemin={0}
              aria-valuemax={totalItems}
              aria-label={`${completedCount} of ${totalItems} activities completed`}
            >
              <div className="h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ease-out ${
                    isAllComplete
                      ? 'bg-sage-500 dark:bg-sage-400'
                      : 'bg-primary-500 dark:bg-primary-400'
                  }`}
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Encouragement */}
          <p
            className={`text-xs font-medium transition-colors sm:min-w-[160px] sm:text-right ${
              isAllComplete
                ? 'text-sage-600 dark:text-sage-400'
                : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            {encouragementMessage}
          </p>
        </div>
      </div>
    </section>
  );
}
