import { useState, useCallback } from 'react';

interface MoodOption {
  value: string;
  label: string;
  emoji: string;
  description: string;
  color: string;
}

const MOOD_OPTIONS: MoodOption[] = [
  { value: 'great', label: 'Great', emoji: '😊', description: 'Feeling wonderful', color: 'bg-sage-100 border-sage-500 text-sage-700' },
  { value: 'good', label: 'Good', emoji: '🙂', description: 'Doing alright', color: 'bg-sage-100 border-sage-400 text-sage-600' },
  { value: 'okay', label: 'Okay', emoji: '😐', description: 'Somewhere in the middle', color: 'bg-warm-100 border-amber-400 text-amber-700' },
  { value: 'low', label: 'Low', emoji: '😔', description: 'Feeling a bit down', color: 'bg-primary-100 border-primary-300 text-primary-700' },
  { value: 'struggling', label: 'Struggling', emoji: '😢', description: 'Having a hard time', color: 'bg-primary-100 border-primary-500 text-primary-700' },
];

interface MoodCheckinProps {
  onMoodSelect?: (mood: MoodOption) => void;
}

export function MoodCheckin({ onMoodSelect }: MoodCheckinProps) {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleSelect = useCallback((mood: MoodOption) => {
    setSelectedMood(mood.value);
    setShowConfirmation(true);
    onMoodSelect?.(mood);
  }, [onMoodSelect]);

  return (
    <section id="mood" className="py-16 sm:py-24 bg-white" aria-labelledby="mood-heading">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2
            id="mood-heading"
            className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight"
          >
            How are you feeling right now?
          </h2>
          <p className="mt-2 text-base text-slate-500">
            There are no wrong answers. Just check in with yourself.
          </p>
        </div>

        {!showConfirmation ? (
          <div
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 max-w-3xl mx-auto"
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
                className={`flex flex-col items-center gap-2 p-4 sm:p-6 rounded-2xl border-2 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] min-h-[100px] justify-center cursor-pointer ${
                  selectedMood === mood.value
                    ? `${mood.color} border-current shadow-sm`
                    : 'border-slate-200 bg-slate-50 hover:border-slate-300 hover:bg-white'
                }`}
                onClick={() => handleSelect(mood)}
              >
                <span className="text-3xl sm:text-4xl" role="img" aria-hidden="true">
                  {mood.emoji}
                </span>
                <span className="text-sm font-medium text-slate-700">
                  {mood.label}
                </span>
                <span className="text-xs text-slate-400 hidden sm:block">
                  {mood.description}
                </span>
              </button>
            ))}
          </div>
        ) : (
          <div className="max-w-md mx-auto text-center animate-fade-in">
            {selectedMood && (
              <div className="p-6 sm:p-8 bg-sage-50 border border-sage-200 rounded-2xl">
                <span className="text-5xl block mb-3" role="img" aria-hidden="true">
                  {MOOD_OPTIONS.find(m => m.value === selectedMood)?.emoji}
                </span>
                <h3 className="text-lg font-semibold text-slate-900 mb-1">
                  Thank you for checking in
                </h3>
                <p className="text-sm text-slate-600 mb-6">
                  Noticing how you feel is the first step. Whatever you&apos;re
                  experiencing is valid.
                </p>
                <button
                  type="button"
                  className="px-5 py-2.5 text-sm font-medium text-primary-600 bg-primary-50 rounded-xl hover:bg-primary-100 transition-colors min-h-[44px]"
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

        {/* Tip below */}
        <p className="mt-8 text-center text-xs text-slate-400">
          Your check-in stays private. We don&apos;t store or share your data.
        </p>
      </div>
    </section>
  );
}
