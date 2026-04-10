import { useState, useEffect, useCallback } from 'react';

interface ChecklistItem {
  id: string;
  label: string;
  icon: string;
}

const CHECKLIST_ITEMS: ChecklistItem[] = [
  { id: 'hydrate', label: 'Drink a glass of water', icon: '\u{1F4A7}' },
  { id: 'move', label: 'Move for 5 minutes', icon: '\u{1F3C3}' },
  { id: 'breathe', label: 'Take 3 deep breaths', icon: '\u{1F30A}' },
  { id: 'connect', label: 'Reach out to someone', icon: '\u{1F91D}' },
  { id: 'reflect', label: 'Name one good thing today', icon: '\u{2B50}' },
];

interface WellnessChecklistProps {
  onProgressChange?: (progress: number, total: number) => void;
}

const STORAGE_KEY = 'handrail-checklist';

function getTodayKey(): string {
  return new Date().toISOString().split('T')[0];
}

function loadCheckedItems(): string[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    const parsed: unknown = JSON.parse(stored);
    if (!parsed || typeof parsed !== 'object') return [];
    const data = parsed as Record<string, unknown>;
    if (!('date' in data) || !('items' in data)) return [];
    if (data.date === getTodayKey() && Array.isArray(data.items)) return data.items as string[];
    return [];
  } catch {
    return [];
  }
}

function saveCheckedItems(items: string[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      date: getTodayKey(),
      items,
    }));
  } catch {
    // ignore
  }
}

export function WellnessChecklist({ onProgressChange }: WellnessChecklistProps) {
  const [checked, setChecked] = useState<string[]>([]);

  useEffect(() => {
    const loaded = loadCheckedItems();
    setChecked(loaded);
    onProgressChange?.(loaded.length, CHECKLIST_ITEMS.length);
  }, [onProgressChange]);

  const handleToggle = useCallback((id: string): void => {
    setChecked(prev => {
      const next = prev.includes(id)
        ? prev.filter(item => item !== id)
        : [...prev, id];
      saveCheckedItems(next);
      onProgressChange?.(next.length, CHECKLIST_ITEMS.length);
      return next;
    });
  }, [onProgressChange]);

  const progress = checked.length;
  const total = CHECKLIST_ITEMS.length;
  const isComplete = progress === total;
  const progressPercent = total > 0 ? (progress / total) * 100 : 0;

  return (
    <section className="py-12 sm:py-16 bg-white dark:bg-slate-800" aria-labelledby="checklist-heading">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-lg mx-auto">
          <div className="text-center mb-6">
            <h2
              id="checklist-heading"
              className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight"
            >
              Daily Wellness Checklist
            </h2>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Small steps make a big difference. Check off what you&apos;ve done today.
            </p>
          </div>

          {/* Progress bar */}
          <div className="mb-6" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={total} aria-label={`${progress} of ${total} items completed`}>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
                {progress}/{total} completed
              </span>
              <span className="text-xs text-slate-400 dark:text-slate-500">
                {Math.round(progressPercent)}%
              </span>
            </div>
            <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ease-out ${
                  isComplete
                    ? 'bg-sage-500 dark:bg-sage-400'
                    : 'bg-primary-500 dark:bg-primary-400'
                }`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Checklist items */}
          <div className="space-y-2" role="group" aria-label="Wellness checklist items">
            {CHECKLIST_ITEMS.map((item) => {
              const isChecked = checked.includes(item.id);
              return (
                <button
                  key={item.id}
                  type="button"
                  role="checkbox"
                  aria-checked={isChecked}
                  onClick={() => handleToggle(item.id)}
                  className={`w-full flex items-center gap-3 p-3.5 rounded-xl border-2 transition-all duration-200 text-left min-h-[44px] ${
                    isChecked
                      ? 'bg-sage-50 dark:bg-sage-900/20 border-sage-200 dark:border-sage-800'
                      : 'bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500'
                  }`}
                >
                  <span className="text-xl flex-shrink-0" aria-hidden="true">
                    {item.icon}
                  </span>
                  <span className={`flex-1 text-sm font-medium transition-colors ${
                    isChecked
                      ? 'text-sage-700 dark:text-sage-300 line-through'
                      : 'text-slate-700 dark:text-slate-300'
                  }`}>
                    {item.label}
                  </span>
                  <div
                    className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all duration-200 ${
                      isChecked
                        ? 'bg-sage-500 dark:bg-sage-400 border-sage-500 dark:border-sage-400'
                        : 'border-slate-300 dark:border-slate-500'
                    }`}
                    aria-hidden="true"
                  >
                    {isChecked && (
                      <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M2 6l3 3 5-5" />
                      </svg>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Completion message */}
          {isComplete && (
            <div className="mt-4 p-4 bg-sage-50 dark:bg-sage-900/20 border border-sage-200 dark:border-sage-800 rounded-xl animate-fade-in text-center" role="status">
              <span className="text-2xl block mb-1" aria-hidden="true">{'\u{1F389}'}</span>
              <p className="text-sm font-medium text-sage-700 dark:text-sage-300">
                Amazing! You completed all your wellness tasks today.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
