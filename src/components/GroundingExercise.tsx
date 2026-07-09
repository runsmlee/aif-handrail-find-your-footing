import { useState, useCallback, useRef, useEffect } from 'react';
import { trackEvent } from '../utils/analytics';

const STORAGE_KEY = 'handrail-grounding-state';

type GroundingPhase = 'intro' | 'see' | 'touch' | 'hear' | 'smell' | 'taste' | 'complete';

interface StepConfig {
  key: GroundingPhase;
  title: string;
  description: string;
  prompt: string;
  count: number;
  icon: string;
}

const STEPS: StepConfig[] = [
  { key: 'see', title: '5 Things You Can See', description: 'Look around and name five things you can see.', prompt: 'What do you see?', count: 5, icon: '\u{1F441}\u{FE0F}' },
  { key: 'touch', title: '4 Things You Can Touch', description: 'Notice four things you can physically feel.', prompt: 'What can you touch?', count: 4, icon: '\u{1F932}' },
  { key: 'hear', title: '3 Things You Can Hear', description: 'Listen for three distinct sounds around you.', prompt: 'What do you hear?', count: 3, icon: '\u{1F442}' },
  { key: 'smell', title: '2 Things You Can Smell', description: 'Notice two scents, even subtle ones.', prompt: 'What do you smell?', count: 2, icon: '\u{1F443}' },
  { key: 'taste', title: '1 Thing You Can Taste', description: 'Focus on one taste in your mouth right now.', prompt: 'What do you taste?', count: 1, icon: '\u{1F351}' },
];

interface GroundingPersistState {
  phase: GroundingPhase;
  currentStepIndex: number;
}

export function GroundingExercise() {
  const [phase, setPhase] = useState<GroundingPhase>('intro');
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [items, setItems] = useState<string[]>([]);
  const [itemKeys, setItemKeys] = useState<number[]>([]);
  const keyCounter = useRef(0);

  const currentStep = STEPS[currentStepIndex];

  // Restore in-progress exercise from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed: GroundingPersistState = JSON.parse(saved);
        if (parsed.phase && parsed.phase !== 'intro' && parsed.phase !== 'complete') {
          setPhase(parsed.phase);
          setCurrentStepIndex(parsed.currentStepIndex ?? 0);
        } else {
          localStorage.removeItem(STORAGE_KEY);
        }
      }
    } catch {
      // ignore parse errors
    }
  }, []);

  // Persist exercise progress when in an active step
  useEffect(() => {
    try {
      if (phase !== 'intro' && phase !== 'complete') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ phase, currentStepIndex }));
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch {
      // ignore storage errors
    }
  }, [phase, currentStepIndex]);

  const handleStart = useCallback(() => {
    setPhase('see');
    setCurrentStepIndex(0);
    setItems([]);
    setItemKeys([]);
    keyCounter.current = 0;
    trackEvent('grounding_started');
  }, []);

  const handleNext = useCallback(() => {
    const nextIndex = currentStepIndex + 1;
    if (nextIndex < STEPS.length) {
      setPhase(STEPS[nextIndex].key);
      setCurrentStepIndex(nextIndex);
      setItems([]);
      setItemKeys([]);
    } else {
      setPhase('complete');
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch {
        // ignore
      }
      trackEvent('grounding_completed');
    }
  }, [currentStepIndex]);

  const handleAddItem = useCallback(() => {
    if (items.length < (currentStep?.count ?? 0)) {
      keyCounter.current += 1;
      setItems(prev => [...prev, '']);
      setItemKeys(prev => [...prev, keyCounter.current]);
    }
  }, [items.length, currentStep]);

  const handleItemChange = useCallback((index: number, value: string) => {
    setItems(prev => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  }, []);

  const handleReset = useCallback(() => {
    setPhase('intro');
    setCurrentStepIndex(0);
    setItems([]);
    setItemKeys([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  }, []);

  return (
    <section id="grounding" className="py-16 sm:py-24 bg-white dark:bg-slate-800" aria-labelledby="grounding-heading">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2
            id="grounding-heading"
            className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight"
          >
            5-4-3-2-1 Grounding
          </h2>
          <p className="mt-2 text-base text-slate-500 dark:text-slate-400">
            A sensory technique to bring your focus to the present moment.
          </p>
        </div>

        <div className="max-w-lg mx-auto">
          {/* Intro */}
          {phase === 'intro' && (
            <div className="text-center animate-fade-in">
              <div className="flex items-center justify-center gap-3 mb-6">
                {STEPS.map((step) => (
                  <span key={step.key} className="text-2xl" aria-hidden="true">{step.icon}</span>
                ))}
              </div>
              <p className="text-slate-600 dark:text-slate-400 mb-8">
                When you feel overwhelmed, this technique helps you reconnect
                with your senses and the present moment. Take your time with each step.
              </p>
              <button
                type="button"
                className="px-8 py-3 text-base font-medium text-white bg-primary-500 dark:bg-primary-600 rounded-xl hover:bg-primary-600 dark:hover:bg-primary-700 transition-colors shadow-sm shadow-primary-500/25 min-h-[44px]"
                onClick={handleStart}
              >
                Let&apos;s Begin
              </button>
            </div>
          )}

          {/* Active step */}
          {currentStep && (phase === currentStep.key) && (
            <div className="animate-fade-in" role="form" aria-label={currentStep.title}>
              {/* Progress */}
              <div
                className="flex items-center gap-2 mb-6"
                role="progressbar"
                aria-valuenow={currentStepIndex + 1}
                aria-valuemin={1}
                aria-valuemax={STEPS.length}
                aria-label={`Step ${currentStepIndex + 1} of ${STEPS.length}: ${currentStep.title}`}
              >
                {STEPS.map((step, i) => (
                  <div
                    key={step.key}
                    className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${
                      i <= currentStepIndex ? 'bg-primary-400 dark:bg-primary-500' : 'bg-slate-200 dark:bg-slate-600'
                    }`}
                    aria-hidden="true"
                  />
                ))}
              </div>

              <div className="text-center mb-6">
                <span className="text-3xl block mb-2" aria-hidden="true">{currentStep.icon}</span>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white">{currentStep.title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{currentStep.description}</p>
              </div>

              {/* Input items */}
              <div className="space-y-3 mb-6">
                {items.map((item, i) => (
                  <div key={itemKeys[i] ?? i}>
                    <label htmlFor={`grounding-item-${itemKeys[i] ?? i}`} className="sr-only">
                      {currentStep.prompt} item {i + 1}
                    </label>
                    <input
                      id={`grounding-item-${itemKeys[i] ?? i}`}
                      type="text"
                      className="w-full px-4 py-3 text-sm border border-slate-200 dark:border-slate-600 rounded-xl focus:border-primary-400 dark:focus:border-primary-500 focus:ring-2 focus:ring-primary-100 dark:focus:ring-primary-900/30 transition-colors bg-slate-50 dark:bg-slate-700 focus:bg-white dark:focus:bg-slate-700 text-slate-800 dark:text-slate-200"
                      placeholder={`${currentStep.prompt} (${i + 1} of ${currentStep.count})`}
                      value={item}
                      onChange={(e) => handleItemChange(i, e.target.value)}
                      autoComplete="off"
                    />
                  </div>
                ))}

                {items.length < currentStep.count && (
                  <button
                    type="button"
                    className="w-full px-4 py-3 text-sm text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20 border border-dashed border-primary-200 dark:border-primary-800 rounded-xl hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-colors min-h-[44px]"
                    onClick={handleAddItem}
                  >
                    + Add {items.length + 1} of {currentStep.count}
                  </button>
                )}
              </div>

              {/* Navigation */}
              <div className="flex justify-between">
                <button
                  type="button"
                  className="px-4 py-2.5 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors min-h-[44px]"
                  onClick={handleReset}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="px-6 py-2.5 text-sm font-medium text-white bg-primary-500 dark:bg-primary-600 rounded-xl hover:bg-primary-600 dark:hover:bg-primary-700 transition-colors min-h-[44px]"
                  onClick={handleNext}
                >
                  {currentStepIndex < STEPS.length - 1 ? 'Next Step' : 'Finish'}
                </button>
              </div>
            </div>
          )}

          {/* Complete */}
          {phase === 'complete' && (
            <div className="text-center animate-fade-in">
              <div className="p-8 bg-sage-50 dark:bg-sage-900/20 border border-sage-200 dark:border-sage-800 rounded-2xl">
                <span className="text-5xl block mb-3" role="img" aria-hidden="true">{'\u{1F331}'}</span>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                  You&apos;re grounded
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
                  You used your five senses to reconnect with the present moment.
                  Take a deep breath and notice how you feel now.
                </p>
                <button
                  type="button"
                  className="px-6 py-2.5 text-sm font-medium text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/30 rounded-xl hover:bg-primary-100 dark:hover:bg-primary-900/50 transition-colors min-h-[44px]"
                  onClick={handleReset}
                >
                  Try Again
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
