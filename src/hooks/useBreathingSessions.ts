import { useState, useCallback, useEffect, useMemo } from 'react';

export interface BreathingSession {
  timestamp: number;
  exercise_type: string;
  duration_seconds: number;
}

const STORAGE_KEY = 'handrail-breathing-sessions';
const MAX_ENTRIES = 100;

function loadSessions(): BreathingSession[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    const parsed: unknown = JSON.parse(stored);
    if (!Array.isArray(parsed)) return [];
    return parsed as BreathingSession[];
  } catch {
    return [];
  }
}

function saveSessions(sessions: BreathingSession[]): void {
  try {
    const trimmed = sessions.slice(0, MAX_ENTRIES);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
  } catch {
    // localStorage might be full or unavailable
  }
}

export function useBreathingSessions() {
  const [sessions, setSessions] = useState<BreathingSession[]>([]);

  useEffect(() => {
    setSessions(loadSessions());
  }, []);

  const sessionsThisWeek = useMemo(() => {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const startOfWeek = new Date(now);
    // Monday-based week
    const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    startOfWeek.setDate(startOfWeek.getDate() + diff);
    startOfWeek.setHours(0, 0, 0, 0);

    return sessions.filter(s => s.timestamp >= startOfWeek.getTime()).length;
  }, [sessions]);

  const addSession = useCallback((exerciseType: string, durationSeconds: number): void => {
    const newSession: BreathingSession = {
      timestamp: Date.now(),
      exercise_type: exerciseType,
      duration_seconds: durationSeconds,
    };
    setSessions(prev => {
      const updated = [newSession, ...prev].slice(0, MAX_ENTRIES);
      saveSessions(updated);
      return updated;
    });
  }, []);

  return { sessions, sessionsThisWeek, addSession };
}
