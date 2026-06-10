import { useMemo } from 'react';
import { HeroGroundingModule } from './HeroGroundingModule';

interface HeroProps {
  streak?: number;
}

function getTimeGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

function getStreakMilestone(streak: number): { label: string; next: number } | null {
  const milestones = [3, 7, 14, 30, 60, 90];
  if (streak === 0) return { label: 'Start your streak', next: 3 };
  for (const milestone of milestones) {
    if (streak < milestone) {
      return { label: `${milestone}-day streak`, next: milestone };
    }
  }
  return null;
}

export function Hero({ streak = 0 }: HeroProps) {
  const greeting = useMemo(() => getTimeGreeting(), []);
  const milestone = useMemo(() => getStreakMilestone(streak), [streak]);

  return (
    <section
      className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-primary-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800"
      aria-labelledby="hero-heading"
    >
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]" aria-hidden="true">
        <svg width="100%" height="100%">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        {/* Greeting */}
        <p className="text-center text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">
          {greeting}
        </p>

        {/* Streak indicator with milestone progress */}
        {streak > 0 && milestone && (
          <div className="flex flex-col items-center gap-1.5 mb-4 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-sage-700 dark:text-sage-300 bg-sage-50 dark:bg-sage-900/30 rounded-full">
              <span aria-hidden="true">
                {streak >= 7 ? '\u{1F525}' : '\u{2B50}'}
              </span>
              {streak} day{streak !== 1 ? 's' : ''} streak
            </div>
            {milestone.next > streak && (
              <div className="flex items-center gap-2">
                <div className="w-20 h-1 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-sage-500 dark:bg-sage-400 rounded-full transition-all duration-500"
                    style={{ width: `${((streak % milestone.next) / milestone.next) * 100}%` }}
                  />
                </div>
                <span className="text-[10px] text-slate-400 dark:text-slate-500">
                  {milestone.next - streak} to {milestone.label}
                </span>
              </div>
            )}
          </div>
        )}

        {streak === 0 && milestone && (
          <div className="flex justify-center mb-4 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 rounded-full">
              <span aria-hidden="true">{'\u{1F331}'}</span>
              {milestone.label}
            </div>
          </div>
        )}

        {/* Core identity — the product IS the heading */}
        <h1
          id="hero-heading"
          className="text-center text-4xl sm:text-5xl font-bold tracking-tight text-slate-900 dark:text-white leading-[1.1]"
        >
          <span className="text-primary-500 dark:text-primary-400">Grounding Tool</span>
        </h1>

        <p className="mt-3 sm:mt-4 text-center text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-md mx-auto">
          Free grounding tool — use your five senses to anchor yourself right now.
        </p>

        {/* Interactive grounding module — the hero IS the product */}
        <div className="mt-8 sm:mt-10 bg-white/80 dark:bg-slate-800/60 backdrop-blur-sm rounded-2xl border border-slate-200/80 dark:border-slate-700/80 p-5 sm:p-6 shadow-xl shadow-slate-200/50 dark:shadow-slate-900/50">
          <HeroGroundingModule />
        </div>
      </div>
    </section>
  );
}
