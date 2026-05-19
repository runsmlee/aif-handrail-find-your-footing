import { useState, useEffect, useRef, useCallback } from 'react';
import { useBreathingSessions } from '../hooks/useBreathingSessions';
import { trackEvent } from '../utils/analytics';

type ExerciseType = 'box' | 'grounding';
type BreathingPhase = 'idle' | 'inhale' | 'hold' | 'exhale' | 'done';

interface HeroGroundingModuleProps {
  onBreathingComplete?: () => void;
}

const BOX_PHASES: Record<Exclude<BreathingPhase, 'idle' | 'done'>, { label: string; duration: number }> = {
  inhale: { label: 'Breathe In', duration: 4 },
  hold: { label: 'Hold', duration: 4 },
  exhale: { label: 'Breathe Out', duration: 4 },
};

const GROUNDING_STEPS = [
  { sense: 'See', count: 5, prompt: 'Look around. Name 5 things you can see right now.', icon: '\u{1F441}\u{FE0F}' },
  { sense: 'Touch', count: 4, prompt: 'Reach out. Notice 4 things you can physically feel.', icon: '\u{1F932}' },
  { sense: 'Hear', count: 3, prompt: 'Pause and listen. Find 3 distinct sounds around you.', icon: '\u{1F442}' },
  { sense: 'Smell', count: 2, prompt: 'Breathe deep. Notice 2 scents, even subtle ones.', icon: '\u{1F443}' },
  { sense: 'Taste', count: 1, prompt: 'Focus on 1 taste in your mouth right now.', icon: '\u{1F351}' },
];

const TOTAL_BREATH_CYCLES = 2;

export function HeroGroundingModule({ onBreathingComplete }: HeroGroundingModuleProps) {
  const [selectedExercise, setSelectedExercise] = useState<ExerciseType>('grounding');
  const [breathPhase, setBreathPhase] = useState<BreathingPhase>('idle');
  const [breathSeconds, setBreathSeconds] = useState(0);
  const [breathCycle, setBreathCycle] = useState(0);
  const [groundingStep, setGroundingStep] = useState(-1);

  const breathTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const breathCompletedRef = useRef(false);
  const { addSession } = useBreathingSessions();

  const clearBreathTimer = useCallback(() => {
    if (breathTimerRef.current) {
      clearInterval(breathTimerRef.current);
      breathTimerRef.current = null;
    }
  }, []);

  const resetExercise = useCallback(() => {
    clearBreathTimer();
    setSelectedExercise('grounding');
    setBreathPhase('idle');
    setBreathCycle(0);
    setBreathSeconds(0);
    breathCompletedRef.current = false;
    setGroundingStep(-1);
  }, [clearBreathTimer]);

  const switchToBoxBreathing = useCallback(() => {
    clearBreathTimer();
    setBreathPhase('idle');
    setBreathCycle(0);
    setBreathSeconds(0);
    breathCompletedRef.current = false;
    setGroundingStep(-1);
    setSelectedExercise('box');
  }, [clearBreathTimer]);

  const startBoxBreathing = useCallback(() => {
    breathCompletedRef.current = false;
    setBreathPhase('inhale');
    setBreathCycle(1);
    setBreathSeconds(BOX_PHASES.inhale.duration);
  }, []);

  const stopBoxBreathing = useCallback(() => {
    clearBreathTimer();
    setBreathPhase('idle');
    setBreathCycle(0);
    setBreathSeconds(0);
    breathCompletedRef.current = false;
  }, [clearBreathTimer]);

  // Box breathing timer effect
  useEffect(() => {
    if (breathPhase === 'idle' || breathPhase === 'done') return;

    if (breathSeconds <= 0) {
      if (breathPhase === 'exhale') {
        if (breathCycle >= TOTAL_BREATH_CYCLES) {
          setBreathPhase('done');
          if (!breathCompletedRef.current) {
            breathCompletedRef.current = true;
            const totalSeconds = TOTAL_BREATH_CYCLES * 12;
            addSession('Box Breathing (Hero)', totalSeconds);
            trackEvent('hero_breathing_completed', { cycles: TOTAL_BREATH_CYCLES, duration_seconds: totalSeconds });
            onBreathingComplete?.();
          }
          return;
        }
        setBreathPhase('inhale');
        setBreathCycle(c => c + 1);
        setBreathSeconds(BOX_PHASES.inhale.duration);
      } else if (breathPhase === 'inhale') {
        setBreathPhase('hold');
        setBreathSeconds(BOX_PHASES.hold.duration);
      } else if (breathPhase === 'hold') {
        setBreathPhase('exhale');
        setBreathSeconds(BOX_PHASES.exhale.duration);
      }
      return;
    }

    breathTimerRef.current = setInterval(() => {
      setBreathSeconds(s => s - 1);
    }, 1000);

    return clearBreathTimer;
  }, [breathPhase, breathSeconds, breathCycle, clearBreathTimer, onBreathingComplete]);

  // Grounding handlers
  const startGrounding = useCallback(() => {
    setGroundingStep(0);
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

  const resetGrounding = useCallback(() => {
    setGroundingStep(-1);
  }, []);

  // Calculate ring progress for box breathing
  const activePhaseKey: BreathingPhase | null =
    breathPhase !== 'idle' && breathPhase !== 'done' ? breathPhase : null;
  const phaseDuration = activePhaseKey ? BOX_PHASES[activePhaseKey].duration : 4;
  const phaseProgress = activePhaseKey ? (phaseDuration - breathSeconds) / phaseDuration : 0;

  const ringRadius = 56;
  const ringCircumference = 2 * Math.PI * ringRadius;
  const ringDashoffset = activePhaseKey
    ? ringCircumference * (1 - phaseProgress)
    : ringCircumference;

  const circleScale = (() => {
    if (!activePhaseKey) return 1;
    if (breathPhase === 'inhale') return 1 + phaseProgress * 0.12;
    if (breathPhase === 'hold') return 1.12;
    if (breathPhase === 'exhale') return 1.12 - phaseProgress * 0.12;
    return 1;
  })();

  // ========================
  // RENDER: Box Breathing
  // ========================
  if (selectedExercise === 'box') {
    const isIdle = breathPhase === 'idle';
    const isDone = breathPhase === 'done';
    const currentLabel = activePhaseKey ? BOX_PHASES[activePhaseKey].label : null;

    return (
      <div className="animate-fade-in" role="region" aria-label="Box Breathing exercise">
        <button
          type="button"
          onClick={resetExercise}
          className="mb-3 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors flex items-center gap-1 min-h-[44px]"
          aria-label="Switch to 5-4-3-2-1 Grounding"
        >
          <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Back to Grounding
        </button>

        <div className="flex flex-col items-center">
          {/* Breathing circle */}
          <div className="relative flex items-center justify-center h-44 w-44 sm:h-52 sm:w-52 mb-4" aria-live="polite">
            <svg className="absolute w-full h-full" viewBox="0 0 140 140" aria-hidden="true">
              <circle cx="70" cy="70" r={ringRadius} fill="none" stroke="currentColor" strokeWidth="2.5" className="text-slate-200 dark:text-slate-700" />
              <circle
                cx="70"
                cy="70"
                r={ringRadius}
                fill="none"
                stroke="#ef4444"
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray={ringCircumference}
                strokeDashoffset={ringDashoffset}
                className="transition-all duration-1000 ease-linear"
                transform="rotate(-90 70 70)"
                style={{ opacity: currentLabel ? 0.9 : 0 }}
              />
            </svg>

            <div
              className={`w-32 h-32 sm:w-40 sm:h-40 rounded-full flex items-center justify-center transition-all duration-1000 ease-in-out ${
                isIdle || isDone ? 'bg-slate-200 dark:bg-slate-700' : ''
              }`}
              style={isIdle || isDone ? {} : {
                transform: `scale(${circleScale})`,
                backgroundColor: '#ef4444',
                opacity: 0.85,
              }}
            />

            <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
              {isIdle && (
                <>
                  <p className="text-base font-semibold text-slate-700 dark:text-slate-300">Ready?</p>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{TOTAL_BREATH_CYCLES} cycles</p>
                </>
              )}
              {isDone && (
                <>
                  <p className="text-base font-semibold text-sage-700 dark:text-sage-300">Well done</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Notice how you feel</p>
                </>
              )}
              {currentLabel && (
                <>
                  <p className="text-lg font-bold text-white">{currentLabel}</p>
                  <p className="text-2xl font-bold text-white/90 mt-1">{breathSeconds}</p>
                </>
              )}
            </div>
          </div>

          {/* Progress dots */}
          {!isIdle && !isDone && (
            <div className="flex items-center justify-center gap-2 mb-4" aria-label={`Cycle ${breathCycle} of ${TOTAL_BREATH_CYCLES}`}>
              {Array.from({ length: TOTAL_BREATH_CYCLES }, (_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                    i < breathCycle ? 'bg-primary-500' : 'bg-slate-300 dark:bg-slate-600'
                  }`}
                  aria-hidden="true"
                />
              ))}
            </div>
          )}

          {/* Control button */}
          <button
            type="button"
            className={`px-6 py-2.5 text-sm font-medium rounded-xl transition-colors min-h-[44px] ${
              isIdle || isDone
                ? 'text-white bg-primary-500 hover:bg-primary-600 shadow-sm shadow-primary-500/25'
                : 'text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600'
            }`}
            onClick={isIdle || isDone ? startBoxBreathing : stopBoxBreathing}
            aria-label={isDone ? 'Start another session' : isIdle ? 'Start breathing' : 'Stop breathing'}
          >
            {isDone ? 'Start Again' : isIdle ? 'Begin' : 'Stop'}
          </button>
        </div>
      </div>
    );
  }

  // ========================
  // RENDER: 5-4-3-2-1 Grounding (primary action)
  // ========================
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
          <button
            type="button"
            className="block mx-auto mt-3 text-xs text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors min-h-[44px]"
            onClick={switchToBoxBreathing}
            aria-label="Switch to Box Breathing exercise"
          >
            Prefer breathing? Try Box Breathing
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
              onClick={resetGrounding}
            >
              Try Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
