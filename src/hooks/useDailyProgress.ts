import { useState, useCallback, useEffect } from 'react';

export interface DailyActivity {
  moodCheckedIn: boolean;
  checklistProgress: number;
  checklistTotal: number;
  gratitudeDone: boolean;
  mindfulnessDone: boolean;
  gratitudeEntries: number;
}

const STORAGE_KEY = 'handrail-daily-activity';

function getTodayKey(): string {
  return new Date().toISOString().split('T')[0];
}

function getDefaultActivity(): DailyActivity {
  return {
    moodCheckedIn: false,
    checklistProgress: 0,
    checklistTotal: 5,
    gratitudeDone: false,
    mindfulnessDone: false,
    gratitudeEntries: 0,
  };
}

function loadActivity(): DailyActivity {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return getDefaultActivity();
    const parsed: unknown = JSON.parse(stored);
    if (!parsed || typeof parsed !== 'object') return getDefaultActivity();
    const data = parsed as Record<string, unknown>;
    // Reset if it's a new day
    if (data.date !== getTodayKey()) return getDefaultActivity();
    return {
      moodCheckedIn: typeof data.moodCheckedIn === 'boolean' ? data.moodCheckedIn : false,
      checklistProgress: typeof data.checklistProgress === 'number' ? data.checklistProgress : 0,
      checklistTotal: typeof data.checklistTotal === 'number' ? data.checklistTotal : 5,
      gratitudeDone: typeof data.gratitudeDone === 'boolean' ? data.gratitudeDone : false,
      mindfulnessDone: typeof data.mindfulnessDone === 'boolean' ? data.mindfulnessDone : false,
      gratitudeEntries: typeof data.gratitudeEntries === 'number' ? data.gratitudeEntries : 0,
    };
  } catch {
    return getDefaultActivity();
  }
}

function saveActivity(activity: DailyActivity): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      date: getTodayKey(),
      ...activity,
    }));
  } catch {
    // localStorage might be unavailable
  }
}

export function useDailyProgress() {
  const [activity, setActivity] = useState<DailyActivity>(getDefaultActivity);

  useEffect(() => {
    setActivity(loadActivity());
  }, []);

  const updateActivity = useCallback((updates: Partial<DailyActivity>): void => {
    setActivity(prev => {
      const next = { ...prev, ...updates };
      saveActivity(next);
      return next;
    });
  }, []);

  const markMoodCheckedIn = useCallback((): void => {
    updateActivity({ moodCheckedIn: true });
  }, [updateActivity]);

  const updateChecklistProgress = useCallback((progress: number, total: number): void => {
    updateActivity({ checklistProgress: progress, checklistTotal: total });
  }, [updateActivity]);

  const markGratitudeDone = useCallback((): void => {
    setActivity(prev => {
      const next = {
        ...prev,
        gratitudeDone: true,
        gratitudeEntries: prev.gratitudeEntries + 1,
      };
      saveActivity(next);
      return next;
    });
  }, []);

  const markMindfulnessDone = useCallback((): void => {
    updateActivity({ mindfulnessDone: true });
  }, [updateActivity]);

  return {
    activity,
    markMoodCheckedIn,
    updateChecklistProgress,
    markGratitudeDone,
    markMindfulnessDone,
  };
}
