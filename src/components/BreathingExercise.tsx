import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useBreathingSessions } from '../hooks/useBreathingSessions';

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
}

interface BreathingExerciseProps {
  onComplete?: () => void;
}

const DURATIONS: Record<Duration, DurationConfig> = {
  quick: { label: '1 min', description: '2 cycles', cycles: 2 },
  standard: { label: '2 min', description: '3 cycles', cycles: 3 },
  extended: { label: '4 min', description: '6 cycles', cycles: 6 },
};

const PHASE_COLORS: Record<Exclude<Phase, 'idle' | 'done'>, string> = {
  inhale: '#ef4444',
  hold: '#dc2626',
  exhale: '#f87171',
};

const PHASES: Record<Exclude<Phase, 'idle' | 'done'>, Omit<PhaseConfig, 'color'>> = {
  inhale: { label: 'Breathe In', instruction: 'Slowly breathe in through your nose', duration: 4 },
  hold: { label: 'Hold', instruction: 'Hold your breath gently', duration: 4 },
  exhale: { label: 'Breathe Out', instruction: 'Slowly release through your mouth', duration: 4 },
};

export function BreathingExercise({ onComplete }: BreathingExerciseProps) {
  const [phase, setPhase] = useState<Phase>('idle');
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [cycleCount, setCycleCount] = useState(0);
  const [selectedDuration, setSelectedDuration] = useState<Duration>('standard');
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const hasCompletedRef = useRef(false);
  const { sessionsThisWeek, addSession } = useBreathingSessions();

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
    hasCompletedRef.current = false;
  }, [clearTimer]);

  const startExercise = useCallback(() => {
    hasCompletedRef.current = false;
    setPhase('inhale');
    setCycleCount(1);
    setSecondsLeft(PHASES.inhale.duration);
  }, []);

  // Track total seconds for this session
  const totalSessionSeconds = useMemo((): number => {
    const cycles = DURATIONS[selectedDuration].cycles;
    // Each cycle = inhale + hold + exhale = 4 + 4 + 4 = 12 seconds
    return cycles * 12;
  }, [selectedDuration]);

  useEffect(() => {
    if (phase === 'idle' || phase === 'done') return;

    if (secondsLeft <= 0) {
      if (phase === 'exhale') {
        if (cycleCount >= totalCycles) {
          setPhase('done');
          if (!hasCompletedRef.current) {
            hasCompletedRef.current = true;
            addSession('Box Breathing', totalSessionSeconds);
            onComplete?.();
          }
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
  }, [phase, secondsLeft, cycleCount, totalCycles, clearTimer, onComplete]);

  const currentPhaseConfig = phase !== 'idle' && phase !== 'done' ? PHASES[phase] : null;
  const currentColor = phase !== 'idle' && phase !== 'done' ? PHASE_COLORS[phase] : '#cbd5e1';

  // Calculate SVG ring progress for current phase
  const phaseDuration = currentPhaseConfig?.duration ?? 4;
  const phaseProgress = currentPhaseConfig ? (phaseDuration - secondsLeft) / phaseDuration : 0;
  const ringRadius = 72;
  const ringCircumference = 2 * Math.PI * ringRadius;
  const ringDashoffset = currentPhaseConfig
    ? ringCircumference * (1 - phaseProgress)
    : ringCircumference;

  // Circle scale animation
  const circleScale = (() => {
    if (!currentPhaseConfig) return 1;
    if (phase === 'inhale') return 1 + phaseProgress * 0.15;
    if (phase === 'hold') return 1.15;
    if (phase === 'exhale') return 1.15 - phaseProgress * 0.15;
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
          {sessionsThisWeek > 0 && (
            <span className="inline-flex items-center gap-1 mt-2 px-3 py-1 text-xs font-medium text-sage-700 dark:text-sage-300 bg-sage-50 dark:bg-sage-900/20 rounded-full border border-sage-200 dark:border-sage-800">
              <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
              </svg>
              Sessions this week: {sessionsThisWeek}
            </span>
          )}
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

          {/* Breathing visualization with SVG ring */}
          <div className="relative flex items-center justify-center h-56 sm:h-64 mb-8" aria-live="polite">
            <svg
              className="absolute w-44 h-44 sm:w-52 sm:h-52"
              viewBox="0 0 160 160"
              aria-hidden="true"
            >
              {/* Background ring */}
              <circle
                cx="80"
                cy="80"
                r={ringRadius}
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                className="text-slate-200 dark:text-slate-700"
              />
              {/* Progress ring */}
              <circle
                cx="80"
                cy="80"
                r={ringRadius}
                fill="none"
                stroke={currentColor}
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray={ringCircumference}
                strokeDashoffset={ringDashoffset}
                className="transition-all duration-1000 ease-linear"
                transform="rotate(-90 80 80)"
                style={{ opacity: currentPhaseConfig ? 0.9 : 0 }}
              />
            </svg>

            {/* Inner breathing circle */}
            <div
              className={`w-36 h-36 sm:w-44 sm:h-44 rounded-full flex items-center justify-center transition-all duration-1000 ease-in-out ${
                isIdle || isDone
                  ? 'bg-slate-200 dark:bg-slate-700'
                  : ''
              }`}
              style={isIdle || isDone ? {} : {
                transform: `scale(${circleScale})`,
                backgroundColor: currentColor,
                opacity: 0.85,
              }}
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
                  <p className="text-3xl font-bold text-white/90 mt-1">
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
