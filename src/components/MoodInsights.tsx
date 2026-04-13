import { useMemo } from 'react';
import { type MoodEntry } from '../hooks/useMoodHistory';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

interface MoodInsightsProps {
  history: MoodEntry[];
}

const MOOD_SCORES: Record<string, number> = {
  excellent: 5,
  great: 5,
  good: 4,
  okay: 3,
  low: 2,
  struggling: 1,
  difficult: 1,
};

const MOOD_LABELS: Record<string, string> = {
  excellent: 'Excellent',
  great: 'Great',
  good: 'Good',
  okay: 'Okay',
  low: 'Low',
  struggling: 'Struggling',
  difficult: 'Difficult',
};

function getMoodScore(value: string): number {
  return MOOD_SCORES[value] ?? 3;
}

interface Insight {
  icon: string;
  title: string;
  description: string;
  color: string;
}

// --- Week-over-week comparison helpers ---

function getWeekStart(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Monday-based
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function getWeekEntries(entries: MoodEntry[], weekStart: Date): MoodEntry[] {
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 7);
  return entries.filter(e => {
    const d = new Date(e.timestamp);
    return d >= weekStart && d < weekEnd;
  });
}

function getDayOfWeekEntries(entries: MoodEntry[], dayOfWeek: number): MoodEntry[] {
  return entries.filter(e => new Date(e.timestamp).getDay() === dayOfWeek);
}

function computeWeeklyComparison(history: MoodEntry[]): {
  thisWeekAvg: number | null;
  lastWeekAvg: number | null;
  delta: number | null;
  dayAverages: (number | null)[];
} | null {
  if (history.length < 2) return null;

  const now = new Date();
  const thisWeekStart = getWeekStart(now);
  const lastWeekStart = new Date(thisWeekStart);
  lastWeekStart.setDate(lastWeekStart.getDate() - 7);

  const thisWeekEntries = getWeekEntries(history, thisWeekStart);
  const lastWeekEntries = getWeekEntries(history, lastWeekStart);

  if (thisWeekEntries.length === 0 && lastWeekEntries.length === 0) return null;

  const avg = (entries: MoodEntry[]): number =>
    entries.reduce((s, e) => s + getMoodScore(e.value), 0) / entries.length;

  const thisWeekAvg = thisWeekEntries.length > 0 ? avg(thisWeekEntries) : null;
  const lastWeekAvg = lastWeekEntries.length > 0 ? avg(lastWeekEntries) : null;
  const delta =
    thisWeekAvg !== null && lastWeekAvg !== null
      ? Math.round((thisWeekAvg - lastWeekAvg) * 10) / 10
      : null;

  // 7-day bar chart: Mon=0 ... Sun=6
  const dayAverages: (number | null)[] = [];
  for (let dow = 1; dow <= 7; dow++) {
    const actualDow: number = dow === 7 ? 0 : dow; // JS: 0=Sun, 1=Mon ... 6=Sat
    const dayEntries = getDayOfWeekEntries(history, actualDow);
    dayAverages.push(dayEntries.length > 0 ? avg(dayEntries) : null);
  }

  return { thisWeekAvg, lastWeekAvg, delta, dayAverages };
}

const DAY_LABELS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

function WeekComparison({ data }: { data: NonNullable<ReturnType<typeof computeWeeklyComparison>> }) {
  const barColor = (score: number | null): string => {
    if (score === null) return 'bg-slate-200 dark:bg-slate-700';
    if (score >= 4) return 'bg-sage-500 dark:bg-sage-400';
    if (score >= 3) return 'bg-amber-400 dark:bg-amber-500';
    return 'bg-red-400 dark:bg-red-500';
  };

  const maxHeight = 80; // px for score 5

  return (
    <div className="p-5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
      <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-4">
        This week vs last week
      </h3>

      {/* Delta */}
      <div className="mb-5">
        {data.thisWeekAvg !== null && data.lastWeekAvg !== null && data.delta !== null ? (
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {data.delta > 0 ? (
              <span className="text-sage-600 dark:text-sage-400 font-medium">
                ↑ {Math.abs(data.delta).toFixed(1)} better than last week
              </span>
            ) : data.delta < 0 ? (
              <span className="text-red-500 dark:text-red-400 font-medium">
                ↓ {Math.abs(data.delta).toFixed(1)} lower than last week
              </span>
            ) : (
              <span className="text-slate-500 dark:text-slate-400 font-medium">
                → Same as last week
              </span>
            )}
            {' '}({data.thisWeekAvg.toFixed(1)} vs {data.lastWeekAvg.toFixed(1)})
          </p>
        ) : data.thisWeekAvg !== null ? (
          <p className="text-sm text-slate-500 dark:text-slate-400">
            This week&apos;s average: <span className="font-medium text-slate-700 dark:text-slate-300">{data.thisWeekAvg.toFixed(1)}</span>
          </p>
        ) : (
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Last week&apos;s average: <span className="font-medium text-slate-700 dark:text-slate-300">{data.lastWeekAvg?.toFixed(1) ?? '—'}</span>
          </p>
        )}
      </div>

      {/* 7-day bar chart */}
      <div className="flex items-end justify-between gap-1.5" style={{ height: `${maxHeight + 20}px` }} role="img" aria-label="7-day mood bar chart">
        {data.dayAverages.map((score, i) => {
          const h = score !== null ? Math.max((score / 5) * maxHeight, 6) : 6;
          return (
            <div key={i} className="flex flex-col items-center gap-1 flex-1">
              <div
                className={`w-full max-w-[28px] rounded-t-md transition-all duration-300 ${barColor(score)}`}
                style={{ height: `${h}px` }}
                aria-label={score !== null ? `Day ${DAY_LABELS[i]}: ${score.toFixed(1)}` : `Day ${DAY_LABELS[i]}: no data`}
              />
              <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
                {DAY_LABELS[i]}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// --- Best day of week ---

function computeBestDayOfWeek(history: MoodEntry[]): {
  bestDay: string | null;
  bestAvg: number;
  sufficientData: boolean;
} {
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  // Count total entries per day of week across all history
  const dayOfWeekCounts: Record<number, { total: number; count: number }> = {};
  for (const entry of history) {
    const dow = new Date(entry.timestamp).getDay();
    if (!dayOfWeekCounts[dow]) {
      dayOfWeekCounts[dow] = { total: 0, count: 0 };
    }
    dayOfWeekCounts[dow].total += getMoodScore(entry.value);
    dayOfWeekCounts[dow].count += 1;
  }

  // Need at least 14 days of data for meaningful pattern (2 full weeks)
  const totalDays = new Set(history.map(e => new Date(e.timestamp).toDateString())).size;
  if (totalDays < 14) {
    return { bestDay: null, bestAvg: 0, sufficientData: false };
  }

  let bestDay: string | null = null;
  let bestAvg = 0;
  for (const [dow, data] of Object.entries(dayOfWeekCounts)) {
    const avg = data.total / data.count;
    if (avg > bestAvg) {
      bestAvg = avg;
      bestDay = dayNames[dow as unknown as number];
    }
  }

  return { bestDay, bestAvg: Math.round(bestAvg * 10) / 10, sufficientData: true };
}

function BestDayInsight({ history }: { history: MoodEntry[] }) {
  const result = computeBestDayOfWeek(history);

  if (!result.sufficientData) {
    return (
      <div className="p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
        <div className="flex items-start gap-3">
          <span className="text-xl flex-shrink-0" aria-hidden="true">{'\u{1F4C5}'}</span>
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Best day of week</h3>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Check back after 2 weeks for patterns
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!result.bestDay) return null;

  return (
    <div className="p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
      <div className="flex items-start gap-3">
        <span className="text-xl flex-shrink-0" aria-hidden="true">{'\u{2B50}'}</span>
        <div>
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Best day of week</h3>
          <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
            You tend to feel best on <span className="font-medium text-sage-600 dark:text-sage-400">{result.bestDay}s</span> (avg {result.bestAvg})
          </p>
        </div>
      </div>
    </div>
  );
}

// --- Streak calendar (GitHub-style heatmap for last 28 days) ---

function computeHeatmapData(history: MoodEntry[]): { date: string; score: number | null }[] {
  const data: { date: string; score: number | null }[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 27; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toDateString();

    const dayEntries = history.filter(
      e => new Date(e.timestamp).toDateString() === dateStr
    );

    const score =
      dayEntries.length > 0
        ? dayEntries.reduce((s, e) => s + getMoodScore(e.value), 0) / dayEntries.length
        : null;

    data.push({ date: dateStr, score });
  }
  return data;
}

const HEATMAP_COLORS = [
  'bg-slate-100 dark:bg-slate-800', // no data / score 0
  'bg-red-200 dark:bg-red-900',    // score 1
  'bg-amber-200 dark:bg-amber-800', // score 2
  'bg-amber-400 dark:bg-amber-600', // score 3
  'bg-sage-300 dark:bg-sage-700',   // score 4
  'bg-sage-500 dark:bg-sage-500',   // score 5
];

function getHeatmapColor(score: number | null): string {
  if (score === null) return HEATMAP_COLORS[0];
  const idx = Math.min(Math.round(score), 5);
  return HEATMAP_COLORS[idx] ?? HEATMAP_COLORS[0];
}

function StreakCalendar({ history }: { history: MoodEntry[] }) {
  const heatmapData = computeHeatmapData(history);

  // 4 rows × 7 columns, starting from 28 days ago
  const rows: { date: string; score: number | null }[][] = [];
  for (let r = 0; r < 4; r++) {
    rows.push(heatmapData.slice(r * 7, r * 7 + 7));
  }

  return (
    <div className="p-5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
      <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">
        Mood calendar (last 28 days)
      </h3>
      <div className="space-y-1.5">
        {rows.map((row, ri) => (
          <div key={ri} className="flex gap-1.5">
            {row.map((cell, ci) => (
              <div
                key={`${ri}-${ci}`}
                className={`w-full aspect-square rounded-sm transition-colors ${getHeatmapColor(cell.score)}`}
                title={cell.score !== null ? `${cell.date}: ${cell.score.toFixed(1)}` : `${cell.date}: no data`}
                aria-label={cell.score !== null ? `${cell.date}: mood ${cell.score.toFixed(1)}` : `${cell.date}: no data`}
              />
            ))}
          </div>
        ))}
      </div>
      <div className="flex items-center gap-1.5 mt-3">
        <span className="text-[10px] text-slate-400 dark:text-slate-500">Less</span>
        {HEATMAP_COLORS.slice(1).map((color, i) => (
          <div key={i} className={`w-3 h-3 rounded-sm ${color}`} aria-hidden="true" />
        ))}
        <span className="text-[10px] text-slate-400 dark:text-slate-500">More</span>
      </div>
    </div>
  );
}

// --- Original insights ---

function analyzeInsights(history: MoodEntry[]): Insight[] {
  if (history.length < 2) return [];

  const insights: Insight[] = [];

  // Average mood score
  const scores = history.map(e => getMoodScore(e.value));
  const avg = scores.reduce((a, b) => a + b, 0) / scores.length;

  // Trend: compare recent 3 vs older entries
  const recent = history.slice(0, Math.min(3, history.length));
  const older = history.slice(3, Math.min(7, history.length));

  if (older.length > 0) {
    const recentAvg = recent.reduce((s, e) => s + getMoodScore(e.value), 0) / recent.length;
    const olderAvg = older.reduce((s, e) => s + getMoodScore(e.value), 0) / older.length;
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
  const weeklyComparison = useMemo(() => computeWeeklyComparison(history), [history]);

  if (insights.length === 0 && !weeklyComparison) {
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

        {/* New: Week-over-week comparison */}
        {weeklyComparison && (
          <div className="max-w-3xl mx-auto mb-6">
            <WeekComparison data={weeklyComparison} />
          </div>
        )}

        {/* New: Streak calendar */}
        {history.length >= 2 && (
          <div className="max-w-3xl mx-auto mb-6">
            <StreakCalendar history={history} />
          </div>
        )}

        {/* New: Best day of week */}
        <div className="max-w-3xl mx-auto mb-6">
          <BestDayInsight history={history} />
        </div>

        {/* Original insights grid */}
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
