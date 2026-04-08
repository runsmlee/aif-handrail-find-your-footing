export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-8 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700" role="contentinfo">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
            <svg
              width="20"
              height="20"
              viewBox="0 0 28 28"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
              className="text-primary-400 dark:text-primary-500"
            >
              <path
                d="M8 22V12C8 10.3 8.8 8.7 10.2 7.8L14 5.5L17.8 7.8C19.2 8.7 20 10.3 20 12V22"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path d="M8 22H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Handrail</span>
          </div>

          <nav aria-label="Footer navigation" className="flex items-center gap-6">
            <a href="#mood" className="text-sm text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
              Check In
            </a>
            <a href="#breathe" className="text-sm text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
              Breathe
            </a>
            <a href="#grounding" className="text-sm text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
              Ground
            </a>
            <a href="#gratitude" className="text-sm text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
              Gratitude
            </a>
            <a href="#crisis" className="text-sm text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
              Support
            </a>
          </nav>

          <p className="text-xs text-slate-400 dark:text-slate-500">
            &copy; {currentYear} Handrail. Not a substitute for professional care.
          </p>
        </div>
      </div>
    </footer>
  );
}
