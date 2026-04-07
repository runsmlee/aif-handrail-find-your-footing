import { useState, useCallback, useEffect } from 'react';

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

export function useMoodHistory() {
  const [history, setHistory] = useState<MoodEntry[]>([]);

  useEffect(() => {
    setHistory(loadHistory());
  }, []);

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

  return { history, addEntry, clearHistory };
}
