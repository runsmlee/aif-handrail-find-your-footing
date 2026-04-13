import { useState, useEffect, useMemo } from 'react';
import { type MoodEntry } from '../hooks/useMoodHistory';

interface DailySummaryData {
  hasActivityToday: boolean;
  todayMoodEmoji: string;
  todayMoodLabel: string;
  gratitudeCountToday: number;
  breathingSessionsToday: number;
}

const MOOD_STORAGE_KEY = 'handrail-mood-history';
const GRATITUDE_STORAGE_KEY = 'handrail-gratitude';
const BREATHING_STORAGE_KEY = 'handrail-breathing-sessions';
const DAILY_ACTIVITY_STORAGE_KEY = 'handrail-daily-activity';

function loadDailySummary(): DailySummaryData {
  const now = new Date();
  const todayStr = now.toDateString();

  // Load today's mood
  let todayMoodEmoji = '';
  let todayMoodLabel = '';
  try {
    const stored = localStorage.getItem(MOOD_STORAGE_KEY);
    if (stored) {
      const entries: MoodEntry[] = JSON.parse(stored);
      const todayEntry = entries.find(e => new Date(e.timestamp).toDateString() === todayStr);
      if (todayEntry) {
        todayMoodEmoji = todayEntry.emoji;
        todayMoodLabel = todayEntry.label;
      }
    }
  } catch { /* ignore */ }

  // Count today's gratitude entries
  let gratitudeCountToday = 0;
  try {
    const stored = localStorage.getItem(GRATITUDE_STORAGE_KEY);
    if (stored) {
      const entries: { timestamp: number }[] = JSON.parse(stored);
      gratitudeCountToday = entries.filter(e => new Date(e.timestamp).toDateString() === todayStr).length;
    }
  } catch { /* ignore */ }

  // Count today's breathing sessions
  let breathingSessionsToday = 0;
  try {
    const stored = localStorage.getItem(BREATHING_STORAGE_KEY);
    if (stored) {
      const sessions: { timestamp: number }[] = JSON.parse(stored);
      breathingSessionsToday = sessions.filter(s => new Date(s.timestamp).toDateString() === todayStr).length;
    }
  } catch { /* ignore */ }

  // Check daily activity
  let dailyActivityMoodCheckedIn = false;
  let dailyActivityBreathingSessions = 0;
  try {
    const stored = localStorage.getItem(DAILY_ACTIVITY_STORAGE_KEY);
    if (stored) {
      const data: Record<string, unknown> = JSON.parse(stored);
      const todayKey = now.toISOString().split('T')[0];
      if (data.date === todayKey) {
        dailyActivityMoodCheckedIn = typeof data.moodCheckedIn === 'boolean' ? data.moodCheckedIn : false;
        dailyActivityBreathingSessions = typeof data.breathingSessions === 'number' ? data.breathingSessions : 0;
      }
    }
  } catch { /* ignore */ }

  // Also check mood storage directly as fallback
  if (!dailyActivityMoodCheckedIn && todayMoodEmoji) {
    dailyActivityMoodCheckedIn = true;
  }
  if (dailyActivityBreathingSessions === 0 && breathingSessionsToday > 0) {
    dailyActivityBreathingSessions = breathingSessionsToday;
  }

  const hasActivityToday =
    dailyActivityMoodCheckedIn ||
    gratitudeCountToday > 0 ||
    dailyActivityBreathingSessions > 0;

  return {
    hasActivityToday,
    todayMoodEmoji,
    todayMoodLabel,
    gratitudeCountToday,
    breathingSessionsToday: dailyActivityBreathingSessions,
  };
}

export function DailySummary() {
  const [summary, setSummary] = useState<DailySummaryData>({
    hasActivityToday: false,
    todayMoodEmoji: '',
    todayMoodLabel: '',
    gratitudeCountToday: 0,
    breathingSessionsToday: 0,
  });

  useEffect(() => {
    setSummary(loadDailySummary());
  }, []);

  const visible = useMemo(() => summary.hasActivityToday, [summary.hasActivityToday]);

  if (!visible) return null;

  return (
    <div
      className="mx-4 sm:mx-6 mt-4 p-4 sm:p-5 bg-gradient-to-r from-teal-50 to-sage-50 dark:from-teal-900/20 dark:to-sage-900/20 rounded-2xl border border-teal-200 dark:border-teal-800"
      role="status"
      aria-label="Daily check-in summary"
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/60 dark:bg-slate-800/60 flex items-center justify-center flex-shrink-0 shadow-sm">
          <svg className="w-5 h-5 sm:w-6 sm:h-6 text-sage-600 dark:text-sage-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-teal-800 dark:text-teal-200">
            You&apos;ve checked in today {'\u{2714}'}
          </p>
          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-teal-700 dark:text-teal-300">
            {summary.todayMoodEmoji && (
              <span>
                {summary.todayMoodEmoji} {summary.todayMoodLabel}
              </span>
            )}
            {summary.gratitudeCountToday > 0 && (
              <span>
                {summary.gratitudeCountToday} gratitude{summary.gratitudeCountToday !== 1 ? ' entries' : ' entry'}
              </span>
            )}
            {summary.breathingSessionsToday > 0 && (
              <span>
                {summary.breathingSessionsToday} breathing session{summary.breathingSessionsToday !== 1 ? 's' : ''}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
