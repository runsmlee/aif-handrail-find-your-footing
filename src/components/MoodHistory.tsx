import { type MoodEntry } from '../hooks/useMoodHistory';
import { useCallback } from 'react';

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

function exportMoodHistory(history: MoodEntry[]): void {
  const header = 'date,mood,label,emoji,notes';
  const rows = history.map(entry => {
    const date = new Date(entry.timestamp).toISOString().split('T')[0];
    const escapedLabel = `"${entry.label.replace(/"/g, '""')}"`;
    return `${date},${entry.value},${escapedLabel},${entry.emoji},`;
  });
  const csv = [header, ...rows].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const today = new Date().toISOString().split('T')[0];
  a.href = url;
  a.download = `handrail-mood-history-${today}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function MoodHistory({ history, onClear }: MoodHistoryProps) {
  const handleExport = useCallback(() => {
    exportMoodHistory(history);
  }, [history]);
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

      {/* Mini visualization - SVG line chart */}
      {vizEntries.length > 0 && (
        <div className="mb-4 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
          <p className="text-xs text-slate-400 dark:text-slate-500 mb-2">Recent mood trend</p>
          <div className="relative" role="img" aria-label={`Mood trend chart showing ${vizEntries.length} recent entries`}>
            <svg viewBox="0 0 200 50" className="w-full h-14" preserveAspectRatio="none" aria-hidden="true">
              {/* Grid lines */}
              <line x1="0" y1="10" x2="200" y2="10" stroke="currentColor" strokeWidth="0.5" className="text-slate-200 dark:text-slate-700" />
              <line x1="0" y1="25" x2="200" y2="25" stroke="currentColor" strokeWidth="0.5" className="text-slate-200 dark:text-slate-700" />
              <line x1="0" y1="40" x2="200" y2="40" stroke="currentColor" strokeWidth="0.5" className="text-slate-200 dark:text-slate-700" />

              {/* Area fill */}
              {vizEntries.length > 1 && (
                <path
                  d={(() => {
                    const points = vizEntries.map((entry, i) => {
                      const score = MOOD_SCORES[entry.value] ?? 3;
                      const x = vizEntries.length > 1 ? (i / (vizEntries.length - 1)) * 200 : 100;
                      const y = 45 - ((score - 1) / 4) * 36;
                      return { x, y };
                    });
                    const pathParts = points.map((p, i) => {
                      if (i === 0) return `M${p.x},${p.y}`;
                      const prev = points[i - 1];
                      const cpx1 = prev.x + (p.x - prev.x) * 0.4;
                      const cpx2 = prev.x + (p.x - prev.x) * 0.6;
                      return ` C${cpx1},${prev.y} ${cpx2},${p.y} ${p.x},${p.y}`;
                    });
                    const lastPoint = points[points.length - 1];
                    const firstPoint = points[0];
                    return pathParts.join(' ') + ` L${lastPoint.x},50 L${firstPoint.x},50 Z`;
                  })()}
                  fill="url(#moodGradient)"
                  opacity="0.3"
                />
              )}

              {/* Line */}
              {vizEntries.length > 1 && (
                <path
                  d={(() => {
                    const points = vizEntries.map((entry, i) => {
                      const score = MOOD_SCORES[entry.value] ?? 3;
                      const x = vizEntries.length > 1 ? (i / (vizEntries.length - 1)) * 200 : 100;
                      const y = 45 - ((score - 1) / 4) * 36;
                      return { x, y };
                    });
                    return points.map((p, i) => {
                      if (i === 0) return `M${p.x},${p.y}`;
                      const prev = points[i - 1];
                      const cpx1 = prev.x + (p.x - prev.x) * 0.4;
                      const cpx2 = prev.x + (p.x - prev.x) * 0.6;
                      return ` C${cpx1},${prev.y} ${cpx2},${p.y} ${p.x},${p.y}`;
                    }).join(' ');
                  })()}
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              )}

              {/* Data points */}
              {vizEntries.map((entry, i) => {
                const score = MOOD_SCORES[entry.value] ?? 3;
                const x = vizEntries.length > 1 ? (i / (vizEntries.length - 1)) * 200 : 100;
                const y = 45 - ((score - 1) / 4) * 36;
                return (
                  <g key={entry.timestamp}>
                    <circle cx={x} cy={y} r="3" fill="#ef4444" stroke="white" strokeWidth="1.5" />
                  </g>
                );
              })}

              <defs>
                <linearGradient id="moodGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#ef4444" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>

            {/* Labels for hover */}
            <div className="flex justify-between mt-0.5">
              <span className="text-[10px] text-slate-400 dark:text-slate-500">
                {formatRelativeTime(vizEntries[0].timestamp)}
              </span>
              <span className="text-[10px] text-slate-400 dark:text-slate-500">
                {formatRelativeTime(vizEntries[vizEntries.length - 1].timestamp)}
              </span>
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center gap-4 mt-2">
            <span className="flex items-center gap-1 text-[10px] text-slate-400 dark:text-slate-500">
              <span className="w-2 h-2 rounded-full bg-sage-500" aria-hidden="true" /> Great/Good
            </span>
            <span className="flex items-center gap-1 text-[10px] text-slate-400 dark:text-slate-500">
              <span className="w-2 h-2 rounded-full bg-amber-400" aria-hidden="true" /> Okay
            </span>
            <span className="flex items-center gap-1 text-[10px] text-slate-400 dark:text-slate-500">
              <span className="w-2 h-2 rounded-full bg-primary-500" aria-hidden="true" /> Low/Struggling
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
        <div className="mt-4 flex items-center gap-4">
          <button
            type="button"
            className="text-xs text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
            onClick={handleExport}
            aria-label="Export mood history as CSV"
          >
            Export CSV
          </button>
          <button
            type="button"
            className="text-xs text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
            onClick={onClear}
          >
            Clear history
          </button>
        </div>
      )}
    </div>
  );
}
