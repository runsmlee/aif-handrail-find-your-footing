import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'handrail-onboarding-complete';
const ONBOARDING_STEPS = [
  {
    title: 'Welcome to Handrail',
    description: 'A gentle companion for your daily mental wellness. Take small steps toward feeling more grounded.',
    icon: '\u{1F91D}',
  },
  {
    title: 'Check In With Yourself',
    description: 'Track how you feel each day. Over time, patterns emerge that help you understand yourself better.',
    icon: '\u{1F4CB}',
  },
  {
    title: 'Breathe & Ground',
    description: 'Use guided breathing exercises and the 5-4-3-2-1 grounding technique to find calm in moments of stress.',
    icon: '\u{1F30A}',
  },
  {
    title: 'Practice Gratitude',
    description: 'Writing down what you\'re grateful for can shift your perspective and build resilience.',
    icon: '\u{1F64F}',
  },
  {
    title: 'You\'re Not Alone',
    description: 'If things get overwhelming, crisis resources are always one tap away. There\'s no shame in reaching out.',
    icon: '\u{2764}\u{FE0F}',
  },
];

export function WelcomeOnboarding() {
  const [visible, setVisible] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    try {
      const completed = localStorage.getItem(STORAGE_KEY);
      if (!completed) {
        setVisible(true);
      }
    } catch {
      // localStorage unavailable
    }
  }, []);

  const handleClose = useCallback((): void => {
    setVisible(false);
    try {
      localStorage.setItem(STORAGE_KEY, 'true');
    } catch {
      // ignore
    }
  }, []);

  const handleNext = useCallback((): void => {
    if (step < ONBOARDING_STEPS.length - 1) {
      setStep(prev => prev + 1);
    } else {
      handleClose();
    }
  }, [step, handleClose]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent): void => {
    if (e.key === 'Escape') {
      handleClose();
    }
  }, [handleClose]);

  const current = ONBOARDING_STEPS[step];
  const isFirst = step === 0;
  const isLast = step === ONBOARDING_STEPS.length - 1;

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="onboarding-title"
      aria-describedby="onboarding-desc"
      onKeyDown={handleKeyDown}
    >
      <div className="w-full max-w-md bg-white dark:bg-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-slide-up">
        {/* Progress bar */}
        <div className="flex gap-1 px-6 pt-6">
          {ONBOARDING_STEPS.map((_, i) => (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
                i <= step ? 'bg-primary-500 dark:bg-primary-400' : 'bg-slate-200 dark:bg-slate-700'
              }`}
              aria-hidden="true"
            />
          ))}
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 text-center">
          <span className="text-5xl block mb-4" aria-hidden="true">
            {current.icon}
          </span>
          <h2
            id="onboarding-title"
            className="text-xl font-bold text-slate-900 dark:text-white mb-2"
          >
            {current.title}
          </h2>
          <p
            id="onboarding-desc"
            className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed"
          >
            {current.description}
          </p>
        </div>

        {/* Actions */}
        <div className="px-6 pb-6 sm:px-8 sm:pb-8 flex items-center justify-between">
          {!isFirst ? (
            <button
              type="button"
              className="text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors min-h-[44px]"
              onClick={() => setStep(prev => prev - 1)}
              aria-label="Go to previous step"
            >
              Back
            </button>
          ) : (
            <button
              type="button"
              className="text-sm font-medium text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors min-h-[44px]"
              onClick={handleClose}
              aria-label="Skip onboarding"
            >
              Skip
            </button>
          )}

          <button
            type="button"
            className="px-6 py-2.5 text-sm font-medium text-white bg-primary-500 dark:bg-primary-600 rounded-xl hover:bg-primary-600 dark:hover:bg-primary-700 transition-colors min-h-[44px]"
            onClick={handleNext}
          >
            {isLast ? 'Get Started' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
}
