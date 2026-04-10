import { useMemo } from 'react';
import { type MoodEntry } from '../hooks/useMoodHistory';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

interface MoodInsightsProps {
  history: MoodEntry[];
}

const MOOD_SCORES: Record<string, number> = {
  great: 5,
  good: 4,
  okay: 3,
  low: 2,
  struggling: 1,
};

const MOOD_LABELS: Record<string, string> = {
  great: 'Great',
  good: 'Good',
  okay: 'Okay',
  low: 'Low',
  struggling: 'Struggling',
};

interface Insight {
  icon: string;
  title: string;
  description: string;
  color: string;
}

function analyzeInsights(history: MoodEntry[]): Insight[] {
  if (history.length < 2) return [];

  const insights: Insight[] = [];

  // Average mood score
  const scores = history.map(e => MOOD_SCORES[e.value] ?? 3);
  const avg = scores.reduce((a, b) => a + b, 0) / scores.length;

  // Trend: compare recent 3 vs older entries
  const recent = history.slice(0, Math.min(3, history.length));
  const older = history.slice(3, Math.min(7, history.length));

  if (older.length > 0) {
    const recentAvg = recent.reduce((s, e) => s + (MOOD_SCORES[e.value] ?? 3), 0) / recent.length;
    const olderAvg = older.reduce((s, e) => s + (MOOD_SCORES[e.value] ?? 3), 0) / older.length;
    const diff = recentAvg - olderAvg;

    if (diff > 0.5) {
      insights.push({
        icon: '\u{1F4C8}',
        title: 'Upward trend',
        description: 'Your mood has been improving recently. Keep up whatever you\'re doing!',
        color: 'text-sage-700 dark:text-sage-300 bg-sage-50 dark:bg-sage-900/20 border-sage-200 dark:border-sage-800',
      });
    } else if (diff < -0.5) {
      insights.push({
        icon: '\u{1F4C9}',
        title: 'Taking care of yourself matters',
        description: 'It\'s okay to have harder days. Small steps like breathing exercises can help.',
        color: 'text-primary-700 dark:text-primary-300 bg-primary-50 dark:bg-primary-900/20 border-primary-200 dark:border-primary-800',
      });
    } else {
      insights.push({
        icon: '\u{2696}\u{FE0F}',
        title: 'Steady pattern',
        description: 'Your mood has been relatively stable. Consistency is a sign of resilience.',
        color: 'text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600',
      });
    }
  }

  // Most frequent mood
  const frequency: Record<string, number> = {};
  for (const entry of history) {
    frequency[entry.value] = (frequency[entry.value] ?? 0) + 1;
  }
  const mostFrequent = Object.entries(frequency).sort((a, b) => b[1] - a[1])[0];
  if (mostFrequent) {
    const moodLabel = MOOD_LABELS[mostFrequent[0]] ?? mostFrequent[0];
    const percentage = Math.round((mostFrequent[1] / history.length) * 100);
    insights.push({
      icon: '\u{1F3AF}',
      title: `Most common: ${moodLabel}`,
      description: `You've felt "${moodLabel}" ${percentage}% of the time (${mostFrequent[1]} check-in${mostFrequent[1] !== 1 ? 's' : ''}).`,
      color: 'text-warm-100 dark:text-warm-100 bg-warm-50 dark:bg-warm-900/10 border-amber-200 dark:border-amber-800',
    });
  }

  // Encouragement based on engagement
  if (history.length >= 5) {
    insights.push({
      icon: '\u{2B50}',
      title: 'Consistent check-ins',
      description: `You've checked in ${history.length} times. Regular self-awareness is a powerful wellness tool.`,
      color: 'text-sage-700 dark:text-sage-300 bg-sage-50 dark:bg-sage-900/20 border-sage-200 dark:border-sage-800',
    });
  }

  // Overall mood quality
  if (avg >= 4) {
    insights.push({
      icon: '\u{1F31F}',
      title: 'Positive outlook',
      description: 'Your overall mood tends toward the positive side. That\'s wonderful.',
      color: 'text-sage-700 dark:text-sage-300 bg-sage-50 dark:bg-sage-900/20 border-sage-200 dark:border-sage-800',
    });
  } else if (avg <= 2.5) {
    insights.push({
      icon: '\u{1F4AA}',
      title: 'Reaching out is strength',
      description: 'If things feel tough, remember: support is always available. You don\'t have to go through this alone.',
      color: 'text-primary-700 dark:text-primary-300 bg-primary-50 dark:bg-primary-900/20 border-primary-200 dark:border-primary-800',
    });
  }

  return insights;
}

export function MoodInsights({ history }: MoodInsightsProps) {
  const sectionRef = useScrollAnimation();
  const insights = useMemo(() => analyzeInsights(history), [history]);

  if (insights.length === 0) {
    return (
      <section className="py-12 sm:py-16 bg-slate-50 dark:bg-slate-900 animate-section-hidden" aria-labelledby="insights-heading" ref={sectionRef}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6">
            <h2 id="insights-heading" className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
              Mood Insights
            </h2>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Check in a few more times to unlock personalized insights about your mood patterns.
            </p>
          </div>
          <div className="max-w-md mx-auto p-6 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 text-center">
            <span className="text-3xl block mb-3" aria-hidden="true">{'\u{1F4CA}'}</span>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              After 2 or more check-ins, we&apos;ll start showing you patterns and trends in your mood.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 sm:py-16 bg-slate-50 dark:bg-slate-900 animate-section-hidden" aria-labelledby="insights-heading" ref={sectionRef}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 id="insights-heading" className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            Mood Insights
          </h2>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Patterns and observations from your check-in history.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 max-w-3xl mx-auto">
          {insights.map((insight) => (
            <div
              key={insight.title}
              className={`p-4 sm:p-5 rounded-2xl border ${insight.color}`}
            >
              <div className="flex items-start gap-3">
                <span className="text-xl flex-shrink-0" aria-hidden="true">{insight.icon}</span>
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                    {insight.title}
                  </h3>
                  <p className="mt-1 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {insight.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
