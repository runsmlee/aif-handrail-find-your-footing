import { useState, useCallback, useEffect, useMemo } from 'react';

export interface MoodEntry {
  value: string;
  label: string;
  emoji: string;
  timestamp: number;
}

const STORAGE_KEY = 'handrail-mood-history';
const MAX_ENTRIES = 30;

function loadHistory(): MoodEntry[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    const parsed: unknown = JSON.parse(stored);
    if (!Array.isArray(parsed)) return [];
    return parsed as MoodEntry[];
  } catch {
    return [];
  }
}

function saveHistory(entries: MoodEntry[]): void {
  try {
    const trimmed = entries.slice(0, MAX_ENTRIES);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
  } catch {
    // localStorage might be full or unavailable
  }
}

function computeStreak(history: MoodEntry[]): number {
  if (history.length === 0) return 0;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayMs = today.getTime();

  // Get unique days from history, sorted most recent first
  const uniqueDays: number[] = [];
  for (const entry of history) {
    const entryDate = new Date(entry.timestamp);
    entryDate.setHours(0, 0, 0, 0);
    const entryMs = entryDate.getTime();
    if (!uniqueDays.includes(entryMs)) {
      uniqueDays.push(entryMs);
    }
  }
  uniqueDays.sort((a, b) => b - a);

  // Check if the most recent entry is today or yesterday
  if (uniqueDays.length === 0) return 0;
  const dayMs = 86400000;
  if (uniqueDays[0] < todayMs - dayMs) return 0;

  let streak = 1;
  for (let i = 1; i < uniqueDays.length; i++) {
    if (uniqueDays[i - 1] - uniqueDays[i] === dayMs) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}

export function useMoodHistory() {
  const [history, setHistory] = useState<MoodEntry[]>([]);

  useEffect(() => {
    setHistory(loadHistory());
  }, []);

  const streak = useMemo(() => computeStreak(history), [history]);

  const addEntry = useCallback((entry: Omit<MoodEntry, 'timestamp'>): void => {
    const newEntry: MoodEntry = {
      ...entry,
      timestamp: Date.now(),
    };
    setHistory(prev => {
      const updated = [newEntry, ...prev].slice(0, MAX_ENTRIES);
      saveHistory(updated);
      return updated;
    });
  }, []);

  const clearHistory = useCallback((): void => {
    setHistory([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  }, []);

  return { history, addEntry, clearHistory, streak };
}
