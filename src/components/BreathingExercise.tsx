import { useState, useEffect, useRef, useCallback } from 'react';

type Phase = 'idle' | 'inhale' | 'hold' | 'exhale' | 'done';
type Duration = 'quick' | 'standard' | 'extended';

interface DurationConfig {
  label: string;
  description: string;
  cycles: number;
}

interface PhaseConfig {
  label: string;
  instruction: string;
  duration: number;
  color: string;
  darkColor: string;
}

const DURATIONS: Record<Duration, DurationConfig> = {
  quick: { label: '1 min', description: '2 cycles', cycles: 2 },
  standard: { label: '2 min', description: '3 cycles', cycles: 3 },
  extended: { label: '4 min', description: '6 cycles', cycles: 6 },
};

const PHASES: Record<Exclude<Phase, 'idle' | 'done'>, PhaseConfig> = {
  inhale: { label: 'Breathe In', instruction: 'Slowly breathe in through your nose', duration: 4, color: 'bg-primary-400', darkColor: 'dark:bg-primary-500' },
  hold: { label: 'Hold', instruction: 'Hold your breath gently', duration: 4, color: 'bg-primary-500', darkColor: 'dark:bg-primary-600' },
  exhale: { label: 'Breathe Out', instruction: 'Slowly release through your mouth', duration: 4, color: 'bg-primary-300', darkColor: 'dark:bg-primary-400' },
};

export function BreathingExercise() {
  const [phase, setPhase] = useState<Phase>('idle');
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [cycleCount, setCycleCount] = useState(0);
  const [selectedDuration, setSelectedDuration] = useState<Duration>('standard');
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const totalCycles = DURATIONS[selectedDuration].cycles;

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const stopExercise = useCallback(() => {
    clearTimer();
    setPhase('idle');
    setCycleCount(0);
    setSecondsLeft(0);
  }, [clearTimer]);

  const startExercise = useCallback(() => {
    setPhase('inhale');
    setCycleCount(1);
    setSecondsLeft(PHASES.inhale.duration);
  }, []);

  useEffect(() => {
    if (phase === 'idle' || phase === 'done') return;

    if (secondsLeft <= 0) {
      if (phase === 'exhale') {
        if (cycleCount >= totalCycles) {
          setPhase('done');
          return;
        }
        setPhase('inhale');
        setCycleCount(c => c + 1);
        setSecondsLeft(PHASES.inhale.duration);
      } else if (phase === 'inhale') {
        setPhase('hold');
        setSecondsLeft(PHASES.hold.duration);
      } else if (phase === 'hold') {
        setPhase('exhale');
        setSecondsLeft(PHASES.exhale.duration);
      }
      return;
    }

    timerRef.current = setInterval(() => {
      setSecondsLeft(s => s - 1);
    }, 1000);

    return clearTimer;
  }, [phase, secondsLeft, cycleCount, totalCycles, clearTimer]);

  const currentPhaseConfig = phase !== 'idle' && phase !== 'done' ? PHASES[phase] : null;

  const circleScale = (() => {
    if (!currentPhaseConfig) return 1;
    const progress = 1 - secondsLeft / currentPhaseConfig.duration;
    if (phase === 'inhale') return 1 + progress * 0.3;
    if (phase === 'hold') return 1.3;
    if (phase === 'exhale') return 1.3 - progress * 0.3;
    return 1;
  })();

  const isIdle = phase === 'idle';
  const isDone = phase === 'done';

  return (
    <section id="breathe" className="py-16 sm:py-24 bg-slate-50 dark:bg-slate-900" aria-labelledby="breathe-heading">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2
            id="breathe-heading"
            className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight"
          >
            Box Breathing
          </h2>
          <p className="mt-2 text-base text-slate-500 dark:text-slate-400">
            A simple technique used by first responders. 4 seconds in, 4 hold, 4 out.
          </p>
        </div>

        <div className="max-w-sm mx-auto">
          {/* Duration selector - only visible when idle */}
          {isIdle && (
            <div className="flex items-center justify-center gap-2 mb-8" role="radiogroup" aria-label="Select exercise duration">
              {(Object.entries(DURATIONS) as [Duration, DurationConfig][]).map(([key, config]) => (
                <button
                  key={key}
                  type="button"
                  role="radio"
                  aria-checked={selectedDuration === key}
                  aria-label={`${config.label}: ${config.description}`}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors min-h-[44px] ${
                    selectedDuration === key
                      ? 'bg-primary-500 dark:bg-primary-600 text-white shadow-sm'
                      : 'bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500'
                  }`}
                  onClick={() => setSelectedDuration(key)}
                >
                  <span className="block">{config.label}</span>
                  <span className="block text-xs opacity-70">{config.description}</span>
                </button>
              ))}
            </div>
          )}

          {/* Breathing circle */}
          <div className="relative flex items-center justify-center h-56 sm:h-64 mb-8" aria-live="polite">
            <div
              className={`w-40 h-40 sm:w-48 sm:h-48 rounded-full flex items-center justify-center transition-all duration-1000 ease-in-out ${
                isIdle || isDone
                  ? 'bg-slate-200 dark:bg-slate-700'
                  : `${currentPhaseConfig?.color ?? ''} ${currentPhaseConfig?.darkColor ?? ''}`
              }`}
              style={{
                transform: `scale(${circleScale})`,
                opacity: isIdle ? 0.5 : 0.85,
              }}
              aria-hidden="true"
            />

            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              {isIdle && (
                <>
                  <p className="text-lg font-semibold text-slate-700 dark:text-slate-300">Ready?</p>
                  <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">
                    {totalCycles} cycles of box breathing
                  </p>
                </>
              )}
              {isDone && (
                <>
                  <p className="text-lg font-semibold text-sage-700 dark:text-sage-300">Well done</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    Notice how you feel now
                  </p>
                </>
              )}
              {currentPhaseConfig && (
                <>
                  <p className="text-xl sm:text-2xl font-bold text-white">
                    {currentPhaseConfig.label}
                  </p>
                  <p className="text-sm text-white/80 mt-1">
                    {secondsLeft}
                  </p>
                  <p className="text-xs text-white/60 mt-2 px-4">
                    {currentPhaseConfig.instruction}
                  </p>
                </>
              )}
            </div>
          </div>

          {/* Progress dots */}
          {!isIdle && !isDone && (
            <div className="flex items-center justify-center gap-2 mb-8" aria-label={`Cycle ${cycleCount} of ${totalCycles}`}>
              {Array.from({ length: totalCycles }, (_, i) => (
                <div
                  key={i}
                  className={`w-2.5 h-2.5 rounded-full transition-colors duration-300 ${
                    i < cycleCount ? 'bg-primary-500 dark:bg-primary-400' : 'bg-slate-300 dark:bg-slate-600'
                  }`}
                  aria-hidden="true"
                />
              ))}
            </div>
          )}

          {/* Controls */}
          <div className="flex justify-center">
            {isIdle || isDone ? (
              <button
                type="button"
                className="px-8 py-3 text-base font-medium text-white bg-primary-500 dark:bg-primary-600 rounded-xl hover:bg-primary-600 dark:hover:bg-primary-700 transition-colors shadow-sm shadow-primary-500/25 min-h-[44px]"
                onClick={startExercise}
                aria-label={isDone ? 'Start another breathing session' : 'Start breathing exercise'}
              >
                {isDone ? 'Start Again' : 'Begin'}
              </button>
            ) : (
              <button
                type="button"
                className="px-8 py-3 text-base font-medium text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors min-h-[44px]"
                onClick={stopExercise}
                aria-label="Stop breathing exercise"
              >
                Stop
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
