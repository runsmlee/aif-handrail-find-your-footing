import { useState, useCallback, useEffect } from 'react';

interface GratitudeEntry {
  text: string;
  timestamp: number;
}

const STORAGE_KEY = 'handrail-gratitude';
const MAX_ENTRIES = 50;

function loadEntries(): GratitudeEntry[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    const parsed: unknown = JSON.parse(stored);
    if (!Array.isArray(parsed)) return [];
    return parsed as GratitudeEntry[];
  } catch {
    return [];
  }
}

function saveEntries(entries: GratitudeEntry[]): void {
  try {
    const trimmed = entries.slice(0, MAX_ENTRIES);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
  } catch {
    // ignore
  }
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

const PROMPTS = [
  'What made you smile today?',
  'Name someone who helped you recently.',
  'What is something you are looking forward to?',
  'What is a skill or ability you are grateful for?',
  'What is something beautiful you noticed today?',
];

function getTodaysPrompt(): string {
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
  );
  return PROMPTS[dayOfYear % PROMPTS.length];
}

export function GratitudeJournal() {
  const [entries, setEntries] = useState<GratitudeEntry[]>([]);
  const [currentText, setCurrentText] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    setEntries(loadEntries());
  }, []);

  const prompt = getTodaysPrompt();

  const handleSubmit = useCallback((): void => {
    const trimmed = currentText.trim();
    if (trimmed.length === 0) return;

    const newEntry: GratitudeEntry = {
      text: trimmed,
      timestamp: Date.now(),
    };

    setEntries(prev => {
      const updated = [newEntry, ...prev].slice(0, MAX_ENTRIES);
      saveEntries(updated);
      return updated;
    });

    setCurrentText('');
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  }, [currentText]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>): void => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleSubmit();
    }
  }, [handleSubmit]);

  const hasTodayEntry = entries.length > 0 &&
    new Date(entries[0].timestamp).toDateString() === new Date().toDateString();

  return (
    <section id="gratitude" className="py-16 sm:py-24 bg-white dark:bg-slate-800" aria-labelledby="gratitude-heading">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2
            id="gratitude-heading"
            className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight"
          >
            Gratitude Journal
          </h2>
          <p className="mt-2 text-base text-slate-500 dark:text-slate-400">
            Writing down what you&apos;re grateful for can shift your perspective and boost well-being.
          </p>
        </div>

        <div className="max-w-lg mx-auto">
          {/* Entry form */}
          <div className="mb-8">
            {hasTodayEntry && !showSuccess ? (
              <div className="p-5 bg-sage-50 dark:bg-sage-900/20 border border-sage-200 dark:border-sage-800 rounded-2xl animate-fade-in">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg" aria-hidden="true">
                    {'\u{1F33F}'}
                  </span>
                  <h3 className="text-sm font-semibold text-sage-700 dark:text-sage-300">
                    Today&apos;s gratitude recorded
                  </h3>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                  &ldquo;{entries[0].text}&rdquo;
                </p>
                <button
                  type="button"
                  className="text-xs font-medium text-sage-600 dark:text-sage-400 hover:text-sage-700 dark:hover:text-sage-300 transition-colors"
                  onClick={() => {
                    setCurrentText(entries[0].text);
                  }}
                >
                  Write another entry
                </button>
              </div>
            ) : null}

            <div className="relative">
              <p className="text-sm text-primary-600 dark:text-primary-400 font-medium mb-2">
                {prompt}
              </p>
              <label htmlFor="gratitude-input" className="sr-only">
                Write what you are grateful for
              </label>
              <textarea
                id="gratitude-input"
                className="w-full px-4 py-3 text-sm border border-slate-200 dark:border-slate-600 rounded-xl focus:border-primary-400 dark:focus:border-primary-500 focus:ring-2 focus:ring-primary-100 dark:focus:ring-primary-900/30 transition-colors bg-slate-50 dark:bg-slate-700 focus:bg-white dark:focus:bg-slate-700 text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 resize-none"
                placeholder="I'm grateful for..."
                rows={3}
                value={currentText}
                onChange={(e) => setCurrentText(e.target.value)}
                onKeyDown={handleKeyDown}
                maxLength={500}
                aria-describedby="gratitude-hint"
              />
              <div className="flex items-center justify-between mt-2">
                <p id="gratitude-hint" className="text-xs text-slate-400 dark:text-slate-500">
                  {currentText.length}/500 &middot; Ctrl+Enter to save
                </p>
                <button
                  type="button"
                  className="px-4 py-2 text-sm font-medium text-white bg-primary-500 dark:bg-primary-600 rounded-lg hover:bg-primary-600 dark:hover:bg-primary-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed min-h-[44px]"
                  onClick={handleSubmit}
                  disabled={currentText.trim().length === 0}
                >
                  Save
                </button>
              </div>
            </div>

            {showSuccess && (
              <div className="mt-3 animate-fade-in flex items-center gap-2 text-sm text-sage-700 dark:text-sage-300" role="status">
                <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                </svg>
                Saved! Gratitude practice helps build resilience.
              </div>
            )}
          </div>

          {/* Past entries */}
          {entries.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                <svg className="w-4 h-4 text-slate-400 dark:text-slate-500" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                  <path d="M13 1H3a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V3a2 2 0 00-2-2zm0 12H3V6h10v7zM3 5V3h10v2H3z"/>
                </svg>
                Past Entries
              </h3>
              <div className="space-y-2" role="list" aria-label="Past gratitude entries">
                {entries.slice(0, 5).map((entry) => (
                  <div
                    key={entry.timestamp}
                    className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl"
                    role="listitem"
                  >
                    <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                      &ldquo;{entry.text}&rdquo;
                    </p>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                      {formatRelativeTime(entry.timestamp)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Empty state */}
          {entries.length === 0 && (
            <div className="text-center py-6">
              <p className="text-sm text-slate-400 dark:text-slate-500">
                Your gratitude entries will appear here. Start by writing something above.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
