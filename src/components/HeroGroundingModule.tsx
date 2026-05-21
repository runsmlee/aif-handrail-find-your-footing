import { useState, useCallback } from 'react';
import { trackEvent } from '../utils/analytics';

const GROUNDING_STEPS = [
  { sense: 'See', count: 5, prompt: 'Look around. Name 5 things you can see right now.', icon: '\u{1F441}\u{FE0F}' },
  { sense: 'Touch', count: 4, prompt: 'Reach out. Notice 4 things you can physically feel.', icon: '\u{1F932}' },
  { sense: 'Hear', count: 3, prompt: 'Pause and listen. Find 3 distinct sounds around you.', icon: '\u{1F442}' },
  { sense: 'Smell', count: 2, prompt: 'Breathe deep. Notice 2 scents, even subtle ones.', icon: '\u{1F443}' },
  { sense: 'Taste', count: 1, prompt: 'Focus on 1 taste in your mouth right now.', icon: '\u{1F351}' },
];

export function HeroGroundingModule() {
  const [groundingStep, setGroundingStep] = useState(-1);

  const resetExercise = useCallback(() => {
    setGroundingStep(-1);
  }, []);

  const startGrounding = useCallback(() => {
    setGroundingStep(0);
    trackEvent('hero_grounding_started');
  }, []);

  const nextGroundingStep = useCallback(() => {
    setGroundingStep(prev => {
      if (prev >= 4) {
        trackEvent('hero_grounding_completed');
        return 5;
      }
      return prev + 1;
    });
  }, []);

  const isIntro = groundingStep === -1;
  const isComplete = groundingStep === 5;
  const currentGroundingStep = groundingStep >= 0 && groundingStep <= 4 ? GROUNDING_STEPS[groundingStep] : null;

  return (
    <div className="animate-fade-in" role="region" aria-label="5-4-3-2-1 Grounding exercise">
      {isIntro && (
        <div className="text-center animate-fade-in">
          <div className="flex items-center justify-center gap-2 mb-4">
            {GROUNDING_STEPS.map((step) => (
              <span key={step.sense} className="text-xl" aria-hidden="true">{step.icon}</span>
            ))}
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
            Use your senses to anchor yourself in the present moment. Take your time with each step.
          </p>
          <button
            type="button"
            className="px-6 py-2.5 text-sm font-medium text-white bg-primary-500 dark:bg-primary-600 rounded-xl hover:bg-primary-600 dark:hover:bg-primary-700 transition-colors shadow-sm shadow-primary-500/25 min-h-[44px]"
            onClick={startGrounding}
          >
            Let&apos;s Begin
          </button>
        </div>
      )}

      {currentGroundingStep && (
        <div className="animate-fade-in">
          {/* Progress */}
          <div className="flex items-center gap-1.5 mb-4" aria-hidden="true">
            {GROUNDING_STEPS.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${
                  i <= groundingStep ? 'bg-primary-400 dark:bg-primary-500' : 'bg-slate-200 dark:bg-slate-600'
                }`}
              />
            ))}
          </div>

          <div className="text-center mb-5">
            <span className="text-3xl block mb-2" aria-hidden="true">{currentGroundingStep.icon}</span>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
              {currentGroundingStep.count} Thing{currentGroundingStep.count !== 1 ? 's' : ''} You Can {currentGroundingStep.sense}
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{currentGroundingStep.prompt}</p>
          </div>

          <div className="flex justify-center gap-3">
            <button
              type="button"
              className="px-4 py-2 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors min-h-[44px]"
              onClick={resetExercise}
            >
              Cancel
            </button>
            <button
              type="button"
              className="px-5 py-2 text-sm font-medium text-white bg-primary-500 dark:bg-primary-600 rounded-xl hover:bg-primary-600 dark:hover:bg-primary-700 transition-colors min-h-[44px]"
              onClick={nextGroundingStep}
            >
              {groundingStep < 4 ? 'Next' : 'Finish'}
            </button>
          </div>
        </div>
      )}

      {isComplete && (
        <div className="text-center animate-fade-in">
          <div className="p-6 bg-sage-50 dark:bg-sage-900/20 border border-sage-200 dark:border-sage-800 rounded-2xl">
            <span className="text-4xl block mb-2" aria-hidden="true">{'\u{1F331}'}</span>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">
              You&apos;re grounded
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
              You used your senses to reconnect with the present moment. Take a deep breath.
            </p>
            <button
              type="button"
              className="px-5 py-2 text-sm font-medium text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/30 rounded-xl hover:bg-primary-100 dark:hover:bg-primary-900/50 transition-colors min-h-[44px]"
              onClick={resetExercise}
            >
              Try Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
