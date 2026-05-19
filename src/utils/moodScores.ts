/**
 * Canonical mood-to-score mapping.
 * Shared by MoodHistory, MoodInsights, and any component
 * that needs to numerically compare mood entries.
 *
 * Scores range from 1 (struggling) to 5 (great/excellent).
 */
export const MOOD_SCORES: Record<string, number> = {
  excellent: 5,
  great: 5,
  good: 4,
  okay: 3,
  low: 2,
  struggling: 1,
  difficult: 1,
};

/**
 * Get a numeric score for a mood value string.
 * Returns 3 (neutral) for unknown mood values.
 */
export function getMoodScore(value: string): number {
  return MOOD_SCORES[value] ?? 3;
}

/**
 * Human-readable labels for mood values.
 */
export const MOOD_LABELS: Record<string, string> = {
  excellent: 'Excellent',
  great: 'Great',
  good: 'Good',
  okay: 'Okay',
  low: 'Low',
  struggling: 'Struggling',
  difficult: 'Difficult',
};
