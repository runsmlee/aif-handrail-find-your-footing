import { useState, useMemo } from 'react';

interface Tip {
  text: string;
  category: string;
}

const TIPS: Tip[] = [
  { text: 'Take a 5-minute walk. Even short movement can shift your perspective.', category: 'Movement' },
  { text: 'Write down three things you can see, two you can hear, and one you can feel.', category: 'Grounding' },
  { text: 'Drink a glass of water. Hydration affects your mood more than you think.', category: 'Body' },
  { text: 'Set a boundary today. It\u2019s okay to say no to something that drains you.', category: 'Boundaries' },
  { text: 'Text someone you trust. Connection doesn\u2019t have to be a long conversation.', category: 'Connection' },
  { text: 'Step outside for 2 minutes. Fresh air and natural light help reset your rhythm.', category: 'Nature' },
  { text: 'Try the 4-7-8 breathing technique: breathe in for 4, hold for 7, out for 8.', category: 'Breathing' },
  { text: 'Name one thing you did well today. Small wins count.', category: 'Self-care' },
  { text: 'Put your phone down for 10 minutes. A brief break from screens can reduce anxiety.', category: 'Mindfulness' },
  { text: 'Stretch your neck and shoulders. Tension often lives there without us noticing.', category: 'Body' },
  { text: 'Listen to one song that makes you feel safe or calm.', category: 'Self-care' },
  { text: 'Look out a window and find something green. Nature glimpses lower stress.', category: 'Nature' },
  { text: 'Write one sentence about how you feel. Naming emotions reduces their power.', category: 'Journaling' },
  { text: 'If you\u2019re overwhelmed, focus on just the next right step.', category: 'Grounding' },
];

export function DailyTip() {
  const [tipIndex, setTipIndex] = useState(0);

  const tip = useMemo(() => TIPS[tipIndex], [tipIndex]);

  const handleNewTip = (): void => {
    setTipIndex((prev) => (prev + 1) % TIPS.length);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="bg-gradient-to-r from-primary-50 to-warm-50 dark:from-primary-900/20 dark:to-warm-900/20 border border-primary-100 dark:border-primary-800 rounded-2xl p-5 sm:p-6">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-10 h-10 bg-white dark:bg-slate-700 rounded-xl flex items-center justify-center shadow-sm">
            <svg
              className="w-5 h-5 text-primary-500 dark:text-primary-400"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold text-primary-600 dark:text-primary-400 uppercase tracking-wide">
                Daily Tip
              </span>
              <span className="text-xs text-primary-400 dark:text-primary-600">·</span>
              <span className="text-xs text-primary-500 dark:text-primary-400">{tip.category}</span>
            </div>
            <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
              {tip.text}
            </p>
            <button
              type="button"
              className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
              onClick={handleNewTip}
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <path d="M1.5 8a6.5 6.5 0 0112.1-3.3M14.5 8a6.5 6.5 0 01-12.1 3.3" />
                <path d="M14 2v3.5h-3.5M2 14v-3.5h3.5" />
              </svg>
              Another tip
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
