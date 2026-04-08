import { useState, useCallback } from 'react';
import { MoodHistory } from './MoodHistory';
import { useMoodHistory } from '../hooks/useMoodHistory';

interface MoodOption {
  value: string;
  label: string;
  emoji: string;
  description: string;
  color: string;
}

const MOOD_OPTIONS: MoodOption[] = [
  { value: 'great', label: 'Great', emoji: '\u{1F60A}', description: 'Feeling wonderful', color: 'bg-sage-100 dark:bg-sage-900/30 border-sage-500 dark:border-sage-400 text-sage-700 dark:text-sage-300' },
  { value: 'good', label: 'Good', emoji: '\u{1F642}', description: 'Doing alright', color: 'bg-sage-100 dark:bg-sage-900/30 border-sage-400 dark:border-sage-500 text-sage-600 dark:text-sage-300' },
  { value: 'okay', label: 'Okay', emoji: '\u{1F610}', description: 'Somewhere in the middle', color: 'bg-warm-100 dark:bg-warm-900/30 border-amber-400 dark:border-amber-500 text-amber-700 dark:text-amber-300' },
  { value: 'low', label: 'Low', emoji: '\u{1F614}', description: 'Feeling a bit down', color: 'bg-primary-100 dark:bg-primary-900/30 border-primary-300 dark:border-primary-500 text-primary-700 dark:text-primary-300' },
  { value: 'struggling', label: 'Struggling', emoji: '\u{1F622}', description: 'Having a hard time', color: 'bg-primary-100 dark:bg-primary-900/30 border-primary-500 dark:border-primary-400 text-primary-700 dark:text-primary-300' },
];

interface MoodCheckinProps {
  onMoodSelect?: (mood: MoodOption) => void;
}

export function MoodCheckin({ onMoodSelect }: MoodCheckinProps) {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const { history, addEntry, clearHistory } = useMoodHistory();

  const handleSelect = useCallback((mood: MoodOption) => {
    setSelectedMood(mood.value);
    setShowConfirmation(true);
    addEntry({ value: mood.value, label: mood.label, emoji: mood.emoji });
    onMoodSelect?.(mood);
  }, [onMoodSelect, addEntry]);

  return (
    <section id="mood" className="py-16 sm:py-24 bg-white dark:bg-slate-800" aria-labelledby="mood-heading">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2
            id="mood-heading"
            className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight"
          >
            How are you feeling right now?
          </h2>
          <p className="mt-2 text-base text-slate-500 dark:text-slate-400">
            There are no wrong answers. Just check in with yourself.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Mood selector */}
            <div>
              {!showConfirmation ? (
                <div
                  className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-3 sm:gap-4"
                  role="radiogroup"
                  aria-labelledby="mood-heading"
                >
                  {MOOD_OPTIONS.map((mood) => (
                    <button
                      key={mood.value}
                      type="button"
                      role="radio"
                      aria-checked={selectedMood === mood.value}
                      aria-label={`${mood.label}: ${mood.description}`}
                      className={`flex flex-col items-center gap-2 p-4 sm:p-5 rounded-2xl border-2 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] min-h-[100px] justify-center cursor-pointer ${
                        selectedMood === mood.value
                          ? `${mood.color} border-current shadow-sm`
                          : 'border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 hover:border-slate-300 dark:hover:border-slate-500 hover:bg-white dark:hover:bg-slate-700'
                      }`}
                      onClick={() => handleSelect(mood)}
                    >
                      <span className="text-3xl sm:text-4xl" role="img" aria-hidden="true">
                        {mood.emoji}
                      </span>
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        {mood.label}
                      </span>
                      <span className="text-xs text-slate-400 dark:text-slate-500 hidden sm:block">
                        {mood.description}
                      </span>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="animate-fade-in">
                  {selectedMood && (
                    <div className="p-6 sm:p-8 bg-sage-50 dark:bg-sage-900/20 border border-sage-200 dark:border-sage-800 rounded-2xl">
                      <span className="text-5xl block mb-3" role="img" aria-hidden="true">
                        {MOOD_OPTIONS.find(m => m.value === selectedMood)?.emoji}
                      </span>
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">
                        Thank you for checking in
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
                        Noticing how you feel is the first step. Whatever you&apos;re
                        experiencing is valid.
                      </p>
                      <button
                        type="button"
                        className="px-5 py-2.5 text-sm font-medium text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/30 rounded-xl hover:bg-primary-100 dark:hover:bg-primary-900/50 transition-colors min-h-[44px]"
                        onClick={() => {
                          setSelectedMood(null);
                          setShowConfirmation(false);
                        }}
                      >
                        Check in again
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Mood history sidebar */}
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                <svg className="w-4 h-4 text-slate-400 dark:text-slate-500" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                  <path d="M8 1.5a6.5 6.5 0 100 13 6.5 6.5 0 000-13zM0 8a8 8 0 1116 0A8 8 0 010 8z" />
                  <path d="M8 3.25a.75.75 0 01.75.75v4.25h3.25a.75.75 0 010 1.5h-4a.75.75 0 01-.75-.75V4A.75.75 0 018 3.25z" />
                </svg>
                Recent Check-ins
              </h3>
              <MoodHistory history={history} onClear={clearHistory} />
            </div>
          </div>
        </div>

        {/* Tip below */}
        <p className="mt-8 text-center text-xs text-slate-400 dark:text-slate-500">
          Your check-in stays private. We don&apos;t store or share your data.
        </p>
      </div>
    </section>
  );
}
