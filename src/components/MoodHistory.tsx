import { type MoodEntry } from '../hooks/useMoodHistory';

interface MoodHistoryProps {
  history: MoodEntry[];
  onClear: () => void;
}

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

  const moodScores: Record<string, number> = {
    great: 5,
    good: 4,
    okay: 3,
    low: 2,
    struggling: 1,
  };

  const recent = history.slice(0, Math.min(3, history.length));
  const avg = recent.reduce((sum, e) => sum + (moodScores[e.value] ?? 3), 0) / recent.length;

  if (avg >= 4) return 'trending positive';
  if (avg <= 2) return 'reaching out for support';
  return 'holding steady';
}

export function MoodHistory({ history, onClear }: MoodHistoryProps) {
  if (history.length === 0) {
    return (
      <div className="text-center py-8 px-4">
        <div className="w-12 h-12 mx-auto mb-3 bg-slate-100 rounded-full flex items-center justify-center">
          <svg
            className="w-6 h-6 text-slate-400"
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
        <p className="text-sm text-slate-500">
          Your mood history will appear here after your first check-in.
        </p>
      </div>
    );
  }

  const trend = getMoodTrendLabel(history);

  return (
    <div>
      {trend && (
        <p className="text-xs text-slate-500 mb-3 flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5 text-primary-400" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
            <path d="M8 1.5a6.5 6.5 0 100 13 6.5 6.5 0 000-13zM0 8a8 8 0 1116 0A8 8 0 010 8z" />
            <path d="M8 4a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 018 4zm0 8a1 1 0 100-2 1 1 0 000 2z" />
          </svg>
          Your mood is <span className="font-medium text-slate-700">{trend}</span>
        </p>
      )}

      <div className="space-y-2" role="list" aria-label="Recent mood entries">
        {history.slice(0, 7).map((entry) => (
          <div
            key={entry.timestamp}
            className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl"
            role="listitem"
          >
            <span className="text-xl" role="img" aria-hidden="true">
              {entry.emoji}
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-700">{entry.label}</p>
              <p className="text-xs text-slate-400">
                {formatRelativeTime(entry.timestamp)}
              </p>
            </div>
          </div>
        ))}
      </div>

      {history.length > 1 && (
        <button
          type="button"
          className="mt-4 text-xs text-slate-400 hover:text-slate-600 transition-colors"
          onClick={onClear}
        >
          Clear history
        </button>
      )}
    </div>
  );
}
