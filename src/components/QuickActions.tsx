interface QuickAction {
  label: string;
  description: string;
  href: string;
  emoji: string;
  color: string;
}

const ACTIONS: QuickAction[] = [
  {
    label: 'Check Your Mood',
    description: 'Quick self-assessment',
    href: '#mood',
    emoji: '\u{1F4CB}',
    color: 'bg-primary-50 dark:bg-primary-900/20 border-primary-100 dark:border-primary-800',
  },
  {
    label: 'Breathe',
    description: '4-4-4 box breathing',
    href: '#breathe',
    emoji: '\u{1F30A}',
    color: 'bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800',
  },
  {
    label: 'Ground Yourself',
    description: '5-4-3-2-1 sensory',
    href: '#grounding',
    emoji: '\u{1F331}',
    color: 'bg-sage-50 dark:bg-sage-900/20 border-sage-100 dark:border-sage-800',
  },
  {
    label: 'Write Gratitude',
    description: 'Shift your perspective',
    href: '#gratitude',
    emoji: '\u{1F64F}',
    color: 'bg-warm-50 dark:bg-warm-900/20 border-warm-100 dark:border-warm-800',
  },
];

export function QuickActions() {
  return (
    <section className="py-10 sm:py-14 bg-slate-50 dark:bg-slate-900" aria-labelledby="quick-actions-heading">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 id="quick-actions-heading" className="sr-only">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {ACTIONS.map((action) => (
            <a
              key={action.href}
              href={action.href}
              className={`group flex flex-col items-center gap-2 p-4 sm:p-5 rounded-2xl border-2 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] min-h-[100px] justify-center ${action.color}`}
            >
              <span className="text-2xl sm:text-3xl" aria-hidden="true">{action.emoji}</span>
              <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 text-center leading-tight">
                {action.label}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 text-center hidden sm:block">
                {action.description}
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
