import { useState, useEffect, useRef, useCallback } from 'react';

type Phase = 'idle' | 'inhale' | 'hold' | 'exhale' | 'done';

interface PhaseConfig {
  label: string;
  instruction: string;
  duration: number;
  color: string;
}

const PHASES: Record<Exclude<Phase, 'idle' | 'done'>, PhaseConfig> = {
  inhale: { label: 'Breathe In', instruction: 'Slowly breathe in through your nose', duration: 4, color: 'bg-primary-400' },
  hold: { label: 'Hold', instruction: 'Hold your breath gently', duration: 4, color: 'bg-primary-500' },
  exhale: { label: 'Breathe Out', instruction: 'Slowly release through your mouth', duration: 4, color: 'bg-primary-300' },
};

const TOTAL_CYCLES = 3;

export function BreathingExercise() {
  const [phase, setPhase] = useState<Phase>('idle');
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [cycleCount, setCycleCount] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const startExercise = useCallback(() => {
    setPhase('inhale');
    setCycleCount(1);
    setSecondsLeft(PHASES.inhale.duration);
  }, []);

  const stopExercise = useCallback(() => {
    clearTimer();
    setPhase('idle');
    setCycleCount(0);
    setSecondsLeft(0);
  }, [clearTimer]);

  useEffect(() => {
    if (phase === 'idle' || phase === 'done') return;

    if (secondsLeft <= 0) {
      if (phase === 'exhale') {
        if (cycleCount >= TOTAL_CYCLES) {
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
  }, [phase, secondsLeft, cycleCount, clearTimer]);

  const currentPhaseConfig = phase !== 'idle' && phase !== 'done' ? PHASES[phase] : null;

  const circleScale = (() => {
    if (!currentPhaseConfig) return 1;
    const progress = 1 - secondsLeft / currentPhaseConfig.duration;
    if (phase === 'inhale') return 1 + progress * 0.3;
    if (phase === 'hold') return 1.3;
    if (phase === 'exhale') return 1.3 - progress * 0.3;
    return 1;
  })();

  return (
    <section id="breathe" className="py-16 sm:py-24 bg-slate-50" aria-labelledby="breathe-heading">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2
            id="breathe-heading"
            className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight"
          >
            Box Breathing
          </h2>
          <p className="mt-2 text-base text-slate-500">
            A simple technique used by first responders. 4 seconds in, 4 hold, 4 out.
          </p>
        </div>

        <div className="max-w-sm mx-auto">
          {/* Breathing circle */}
          <div className="relative flex items-center justify-center h-56 sm:h-64 mb-8" aria-live="polite">
            <div
              className={`w-40 h-40 sm:w-48 sm:h-48 rounded-full flex items-center justify-center transition-all duration-1000 ease-in-out ${
                phase === 'idle' || phase === 'done'
                  ? 'bg-slate-200'
                  : currentPhaseConfig?.color ?? 'bg-slate-200'
              }`}
              style={{
                transform: `scale(${circleScale})`,
                opacity: phase === 'idle' ? 0.5 : 0.85,
              }}
              aria-hidden="true"
            />

            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              {phase === 'idle' && (
                <>
                  <p className="text-lg font-semibold text-slate-700">Ready?</p>
                  <p className="text-sm text-slate-400 mt-1">
                    {TOTAL_CYCLES} cycles of box breathing
                  </p>
                </>
              )}
              {phase === 'done' && (
                <>
                  <p className="text-lg font-semibold text-sage-700">Well done</p>
                  <p className="text-sm text-slate-500 mt-1">
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
          {phase !== 'idle' && phase !== 'done' && (
            <div className="flex items-center justify-center gap-2 mb-8" aria-label={`Cycle ${cycleCount} of ${TOTAL_CYCLES}`}>
              {Array.from({ length: TOTAL_CYCLES }, (_, i) => (
                <div
                  key={i}
                  className={`w-2.5 h-2.5 rounded-full transition-colors duration-300 ${
                    i < cycleCount ? 'bg-primary-500' : 'bg-slate-300'
                  }`}
                  aria-hidden="true"
                />
              ))}
            </div>
          )}

          {/* Controls */}
          <div className="flex justify-center">
            {phase === 'idle' || phase === 'done' ? (
              <button
                type="button"
                className="px-8 py-3 text-base font-medium text-white bg-primary-500 rounded-xl hover:bg-primary-600 transition-colors shadow-sm shadow-primary-500/25 min-h-[44px]"
                onClick={startExercise}
                aria-label={phase === 'done' ? 'Start another breathing session' : 'Start breathing exercise'}
              >
                {phase === 'done' ? 'Start Again' : 'Begin'}
              </button>
            ) : (
              <button
                type="button"
                className="px-8 py-3 text-base font-medium text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors min-h-[44px]"
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
