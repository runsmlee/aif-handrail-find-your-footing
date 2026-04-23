import { useState, useEffect, useRef, useCallback } from 'react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

type TimerState = 'idle' | 'running' | 'paused' | 'complete';

interface DurationOption {
  seconds: number;
  label: string;
  description: string;
}

const DURATIONS: DurationOption[] = [
  { seconds: 60, label: '1 min', description: 'Quick pause' },
  { seconds: 180, label: '3 min', description: 'Short session' },
  { seconds: 300, label: '5 min', description: 'Standard' },
  { seconds: 600, label: '10 min', description: 'Deep session' },
];

const AMBIENT_MESSAGES = [
  'Focus on your breath...',
  'Let go of tension...',
  'Be present in this moment...',
  'Notice the stillness within...',
  'Each breath brings calm...',
  'You are exactly where you need to be...',
  'Release what no longer serves you...',
  'Peace flows through you...',
];

interface MindfulnessTimerProps {
  onComplete?: () => void;
}

export function MindfulnessTimer({ onComplete }: MindfulnessTimerProps) {
  const sectionRef = useScrollAnimation();
  const [state, setState] = useState<TimerState>('idle');
  const [selectedSeconds, setSelectedSeconds] = useState(300);
  const [remainingSeconds, setRemainingSeconds] = useState(300);
  const [messageIndex, setMessageIndex] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const hasCompletedRef = useRef(false);

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    return clearTimer;
  }, [clearTimer]);

  useEffect(() => {
    if (state === 'running') {
      hasCompletedRef.current = false;
      intervalRef.current = setInterval(() => {
        setRemainingSeconds(prev => {
          if (prev <= 1) {
            clearTimer();
            setState('complete');
            if (!hasCompletedRef.current) {
              hasCompletedRef.current = true;
              onComplete?.();
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearTimer();
    }

    return clearTimer;
  }, [state, clearTimer, onComplete]);

  // Rotate ambient messages every 8 seconds during running
  useEffect(() => {
    if (state !== 'running') return;

    const msgInterval = setInterval(() => {
      setMessageIndex(prev => (prev + 1) % AMBIENT_MESSAGES.length);
    }, 8000);

    return () => clearInterval(msgInterval);
  }, [state]);

  const handleStart = useCallback(() => {
    setRemainingSeconds(selectedSeconds);
    setMessageIndex(0);
    hasCompletedRef.current = false;
    setState('running');
  }, [selectedSeconds]);

  const handlePause = useCallback(() => {
    setState('paused');
  }, []);

  const handleResume = useCallback(() => {
    setState('running');
  }, []);

  const handleReset = useCallback(() => {
    clearTimer();
    setState('idle');
    setRemainingSeconds(selectedSeconds);
    setMessageIndex(0);
  }, [selectedSeconds, clearTimer]);

  const formatTime = (secs: number): string => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const progressPercent = selectedSeconds > 0
    ? ((selectedSeconds - remainingSeconds) / selectedSeconds) * 100
    : 0;

  // SVG ring
  const ringRadius = 70;
  const ringCircumference = 2 * Math.PI * ringRadius;
  const ringDashoffset = ringCircumference * (1 - progressPercent / 100);

  const isIdle = state === 'idle';
  const isRunning = state === 'running';
  const isPaused = state === 'paused';
  const isComplete = state === 'complete';

  return (
    <section className="py-16 sm:py-24 bg-white dark:bg-slate-800 animate-section-hidden" aria-labelledby="mindfulness-heading" ref={sectionRef}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2
            id="mindfulness-heading"
            className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight"
          >
            Mindfulness Timer
          </h2>
          <p className="mt-2 text-base text-slate-500 dark:text-slate-400">
            Quiet your mind with a guided meditation timer. No distractions, just presence.
          </p>
        </div>

        <div className="max-w-sm mx-auto">
          {/* Duration selector */}
          {isIdle && (
            <div className="grid grid-cols-4 gap-2 mb-8" role="radiogroup" aria-label="Select meditation duration">
              {DURATIONS.map((option) => (
                <button
                  key={option.seconds}
                  type="button"
                  role="radio"
                  aria-checked={selectedSeconds === option.seconds}
                  aria-label={`${option.label}: ${option.description}`}
                  className={`flex flex-col items-center p-3 rounded-xl transition-all min-h-[44px] ${
                    selectedSeconds === option.seconds
                      ? 'bg-primary-500 dark:bg-primary-600 text-white shadow-sm'
                      : 'bg-slate-50 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500'
                  }`}
                  onClick={() => {
                    setSelectedSeconds(option.seconds);
                    setRemainingSeconds(option.seconds);
                  }}
                >
                  <span className="text-sm font-semibold">{option.label}</span>
                  <span className="text-[10px] opacity-70">{option.description}</span>
                </button>
              ))}
            </div>
          )}

          {/* Timer display */}
          <div className="relative flex items-center justify-center h-56 sm:h-64 mb-6" aria-live="polite">
            {/* SVG ring */}
            <svg
              className="absolute w-44 h-44 sm:w-52 sm:h-52"
              viewBox="0 0 160 160"
              aria-hidden="true"
            >
              <circle
                cx="80"
                cy="80"
                r={ringRadius}
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                className="text-slate-200 dark:text-slate-700"
              />
              <circle
                cx="80"
                cy="80"
                r={ringRadius}
                fill="none"
                stroke="#ef4444"
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray={ringCircumference}
                strokeDashoffset={ringDashoffset}
                className="transition-all duration-1000 ease-linear"
                transform="rotate(-90 80 80)"
                style={{ opacity: isIdle ? 0 : 0.8 }}
              />
            </svg>

            {/* Center content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              {isIdle && (
                <>
                  <p className="text-lg font-semibold text-slate-700 dark:text-slate-300">Ready?</p>
                  <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">
                    {formatTime(selectedSeconds)} session
                  </p>
                </>
              )}
              {(isRunning || isPaused) && (
                <>
                  <p className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white tabular-nums">
                    {formatTime(remainingSeconds)}
                  </p>
                  {isPaused && (
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">Paused</p>
                  )}
                </>
              )}
              {isComplete && (
                <>
                  <span className="text-4xl block mb-2" aria-hidden="true">{'\u{1F33F}'}</span>
                  <p className="text-lg font-semibold text-sage-700 dark:text-sage-300">Session complete</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    Well done. Take a moment to notice how you feel.
                  </p>
                </>
              )}
            </div>
          </div>

          {/* Ambient message */}
          {isRunning && (
            <div className="text-center mb-6 min-h-[20px]">
              <p className="text-sm text-slate-400 dark:text-slate-500 italic animate-fade-in" key={messageIndex}>
                {AMBIENT_MESSAGES[messageIndex]}
              </p>
            </div>
          )}

          {/* Controls */}
          <div className="flex justify-center gap-3">
            {isIdle && (
              <button
                type="button"
                className="px-8 py-3 text-base font-medium text-white bg-primary-500 dark:bg-primary-600 rounded-xl hover:bg-primary-600 dark:hover:bg-primary-700 transition-colors shadow-sm shadow-primary-500/25 min-h-[44px]"
                onClick={handleStart}
                aria-label="Start mindfulness timer"
              >
                Begin
              </button>
            )}
            {isRunning && (
              <>
                <button
                  type="button"
                  className="px-6 py-3 text-sm font-medium text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors min-h-[44px]"
                  onClick={handlePause}
                  aria-label="Pause timer"
                >
                  Pause
                </button>
                <button
                  type="button"
                  className="px-6 py-3 text-sm font-medium text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/30 rounded-xl hover:bg-primary-100 dark:hover:bg-primary-900/50 transition-colors min-h-[44px]"
                  onClick={handleReset}
                  aria-label="Reset timer"
                >
                  Reset
                </button>
              </>
            )}
            {isPaused && (
              <>
                <button
                  type="button"
                  className="px-6 py-3 text-sm font-medium text-white bg-primary-500 dark:bg-primary-600 rounded-xl hover:bg-primary-600 dark:hover:bg-primary-700 transition-colors min-h-[44px]"
                  onClick={handleResume}
                  aria-label="Resume timer"
                >
                  Resume
                </button>
                <button
                  type="button"
                  className="px-6 py-3 text-sm font-medium text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors min-h-[44px]"
                  onClick={handleReset}
                  aria-label="Reset timer"
                >
                  Reset
                </button>
              </>
            )}
            {isComplete && (
              <button
                type="button"
                className="px-8 py-3 text-base font-medium text-white bg-primary-500 dark:bg-primary-600 rounded-xl hover:bg-primary-600 dark:hover:bg-primary-700 transition-colors shadow-sm min-h-[44px]"
                onClick={handleReset}
                aria-label="Start another session"
              >
                Start Again
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
