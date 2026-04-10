import { useMemo } from 'react';

interface HeroProps {
  streak?: number;
}

function getTimeGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

interface MotivationalQuote {
  text: string;
  author: string;
}

const QUOTES: MotivationalQuote[] = [
  { text: 'You don\'t have to control your thoughts. You just have to stop letting them control you.', author: 'Dan Millman' },
  { text: 'Almost everything will work again if you unplug it for a few minutes, including you.', author: 'Anne Lamott' },
  { text: 'The greatest weapon against stress is our ability to choose one thought over another.', author: 'William James' },
  { text: 'Breathe. Let go. And remind yourself that this very moment is the only one you know you have for sure.', author: 'Oprah Winfrey' },
  { text: 'You are not your feelings. You are the one who notices them.', author: 'Eckhart Tolle' },
  { text: 'Nothing can dim the light that shines from within.', author: 'Maya Angelou' },
  { text: 'The only way out is through.', author: 'Robert Frost' },
];

function getDailyQuote(): MotivationalQuote {
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
  );
  return QUOTES[dayOfYear % QUOTES.length];
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
  const quote = useMemo(() => getDailyQuote(), []);
  const milestone = useMemo(() => getStreakMilestone(streak), [streak]);

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-primary-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800" aria-labelledby="hero-heading">
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

      {/* Floating decorative element */}
      <div className="absolute right-8 top-16 sm:right-16 sm:top-24 lg:right-24 lg:top-32 opacity-10 dark:opacity-5 animate-float" aria-hidden="true">
        <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
          <circle cx="60" cy="60" r="50" stroke="currentColor" strokeWidth="1" className="text-primary-500" />
          <circle cx="60" cy="60" r="30" stroke="currentColor" strokeWidth="1" className="text-primary-400" />
          <circle cx="60" cy="60" r="10" fill="currentColor" className="text-primary-300" />
        </svg>
      </div>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32">
        <div className="max-w-2xl">
          {/* Greeting */}
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-3">
            {greeting}
          </p>

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-6 text-xs font-medium text-primary-700 dark:text-primary-300 bg-primary-100 dark:bg-primary-900/40 rounded-full border border-primary-200/60 dark:border-primary-800/40">
            <span className="w-1.5 h-1.5 rounded-full bg-primary-500 animate-pulse-gentle" aria-hidden="true" />
            Your daily wellness companion
          </div>

          {/* Streak indicator with milestone progress */}
          {streak > 0 && milestone && (
            <div className="inline-flex flex-col items-start gap-1.5 mb-4 animate-fade-in">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-sage-700 dark:text-sage-300 bg-sage-50 dark:bg-sage-900/30 rounded-full">
                <span aria-hidden="true">
                  {streak >= 7 ? '\u{1F525}' : '\u{2B50}'}
                </span>
                {streak} day{streak !== 1 ? 's' : ''} streak
              </div>
              {milestone.next > streak && (
                <div className="ml-2 flex items-center gap-2">
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
            <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-4 text-xs font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 rounded-full animate-fade-in">
              <span aria-hidden="true">{'\u{1F331}'}</span>
              {milestone.label}
            </div>
          )}

          <h1
            id="hero-heading"
            className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 dark:text-white leading-[1.1]"
          >
            Find Your{' '}
            <span className="text-primary-500 dark:text-primary-400">Footing</span>
          </h1>

          <p className="mt-4 sm:mt-6 text-lg sm:text-xl text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl">
            A gentle space to check in with yourself. Track your mood, practice
            breathing, and find grounding when things feel unsteady.
          </p>

          <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row gap-3 sm:gap-4">
            <a
              href="#mood"
              className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-white bg-primary-500 dark:bg-primary-600 rounded-xl hover:bg-primary-600 dark:hover:bg-primary-700 active:scale-[0.98] transition-all shadow-sm shadow-primary-500/25 min-h-[44px]"
            >
              Start Checking In
              <svg className="ml-2 w-4 h-4" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M3 8h10m0 0L9 4m4 4L9 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
            <a
              href="#breathe"
              className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-primary-300 dark:hover:border-primary-700 hover:bg-primary-50 dark:hover:bg-primary-900/20 active:scale-[0.98] transition-all min-h-[44px]"
            >
              Try Breathing Exercise
            </a>
          </div>

          {/* Daily quote */}
          <div className="mt-10 sm:mt-14 p-4 bg-white/60 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-700/50 rounded-xl max-w-lg">
            <p className="text-sm text-slate-600 dark:text-slate-400 italic leading-relaxed">
              &ldquo;{quote.text}&rdquo;
            </p>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1.5">
              &mdash; {quote.author}
            </p>
          </div>

          {/* Trust indicators */}
          <div className="mt-8 sm:mt-10 flex flex-wrap items-center gap-6 text-sm text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-sage-500" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
              </svg>
              Free &amp; private
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-sage-500" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
              </svg>
              Evidence-based techniques
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-sage-500" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
              </svg>
              No account required
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
