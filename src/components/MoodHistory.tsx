import { type MoodEntry } from '../hooks/useMoodHistory';

interface MoodHistoryProps {
  history: MoodEntry[];
  onClear: () => void;
}

const MOOD_SCORES: Record<string, number> = {
  great: 5,
  good: 4,
  okay: 3,
  low: 2,
  struggling: 1,
};

const MOOD_COLORS: Record<string, string> = {
  great: 'bg-sage-500',
  good: 'bg-sage-400',
  okay: 'bg-amber-400',
  low: 'bg-primary-400',
  struggling: 'bg-primary-600',
};

function formatRelativeTime(timestamp: number): string {
  const now = Date.now();
  const diffMs = now - timestamp;
  const diffMin = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMin < 1) return 'Just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return new Date(timestamp).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  });
}

function getMoodTrendLabel(history: MoodEntry[]): string | null {
  if (history.length < 2) return null;

  const recent = history.slice(0, Math.min(3, history.length));
  const avg = recent.reduce((sum, e) => sum + (MOOD_SCORES[e.value] ?? 3), 0) / recent.length;

  if (avg >= 4) return 'trending positive';
  if (avg <= 2) return 'reaching out for support';
  return 'holding steady';
}

export function MoodHistory({ history, onClear }: MoodHistoryProps) {
  if (history.length === 0) {
    return (
      <div className="text-center py-8 px-4">
        <div className="w-12 h-12 mx-auto mb-3 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center">
          <svg
            className="w-6 h-6 text-slate-400 dark:text-slate-500"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <path d="M12 8v4l3 3M3 12a9 9 0 1118 0 9 9 0 01-18 0z" />
          </svg>
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Your mood history will appear here after your first check-in.
        </p>
      </div>
    );
  }

  const trend = getMoodTrendLabel(history);

  // Build visualization data - last 7 entries, oldest to newest (left to right)
  const vizEntries = history.slice(0, 7).reverse();

  return (
    <div>
      {trend && (
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-3 flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5 text-primary-400" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
            <path d="M8 1.5a6.5 6.5 0 100 13 6.5 6.5 0 000-13zM0 8a8 8 0 1116 0A8 8 0 010 8z" />
            <path d="M8 4a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 018 4zm0 8a1 1 0 100-2 1 1 0 000 2z" />
          </svg>
          Your mood is <span className="font-medium text-slate-700 dark:text-slate-300">{trend}</span>
        </p>
      )}

      {/* Mini visualization */}
      {vizEntries.length > 0 && (
        <div className="mb-4 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
          <p className="text-xs text-slate-400 dark:text-slate-500 mb-2">Recent mood</p>
          <div className="flex items-end gap-1 h-12" role="img" aria-label="Mood visualization showing recent entries">
            {vizEntries.map((entry) => {
              const score = MOOD_SCORES[entry.value] ?? 3;
              const height = score * 20; // 20% per point
              const colorClass = MOOD_COLORS[entry.value] ?? 'bg-slate-300';
              return (
                <div
                  key={entry.timestamp}
                  className="flex-1 flex items-end justify-center group relative"
                >
                  <div
                    className={`w-full rounded-t-sm transition-all duration-300 ${colorClass} opacity-80`}
                    style={{ height: `${height}%` }}
                    title={`${entry.label} - ${formatRelativeTime(entry.timestamp)}`}
                  />
                  {/* Tooltip on hover */}
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 hidden group-hover:block whitespace-nowrap px-2 py-1 text-[10px] bg-slate-800 dark:bg-slate-700 text-white rounded shadow-lg z-10">
                    {entry.emoji} {entry.label}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-[10px] text-slate-400 dark:text-slate-500">
              {vizEntries.length > 0
                ? formatRelativeTime(vizEntries[0].timestamp)
                : ''}
            </span>
            <span className="text-[10px] text-slate-400 dark:text-slate-500">
              {vizEntries.length > 0
                ? formatRelativeTime(vizEntries[vizEntries.length - 1].timestamp)
                : ''}
            </span>
          </div>
        </div>
      )}

      <div className="space-y-2" role="list" aria-label="Recent mood entries">
        {history.slice(0, 7).map((entry) => (
          <div
            key={entry.timestamp}
            className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl"
            role="listitem"
          >
            <span className="text-xl" role="img" aria-hidden="true">
              {entry.emoji}
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{entry.label}</p>
              <p className="text-xs text-slate-400 dark:text-slate-500">
                {formatRelativeTime(entry.timestamp)}
              </p>
            </div>
          </div>
        ))}
      </div>

      {history.length > 1 && (
        <button
          type="button"
          className="mt-4 text-xs text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
          onClick={onClear}
        >
          Clear history
        </button>
      )}
    </div>
  );
}
