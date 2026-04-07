export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-primary-50" aria-labelledby="hero-heading">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-[0.03]" aria-hidden="true">
        <svg width="100%" height="100%">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32">
        <div className="max-w-2xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-6 text-xs font-medium text-primary-700 bg-primary-100 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-primary-500 animate-pulse-gentle" aria-hidden="true" />
            Your daily wellness companion
          </div>

          <h1
            id="hero-heading"
            className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 leading-[1.1]"
          >
            Find Your{' '}
            <span className="text-primary-500">Footing</span>
          </h1>

          <p className="mt-4 sm:mt-6 text-lg sm:text-xl text-slate-600 leading-relaxed max-w-xl">
            A gentle space to check in with yourself. Track your mood, practice
            breathing, and find grounding when things feel unsteady.
          </p>

          <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row gap-3 sm:gap-4">
            <a
              href="#mood"
              className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-white bg-primary-500 rounded-xl hover:bg-primary-600 transition-colors shadow-sm shadow-primary-500/25 min-h-[44px]"
            >
              Start Checking In
              <svg className="ml-2 w-4 h-4" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M3 8h10m0 0L9 4m4 4L9 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
            <a
              href="#breathe"
              className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-slate-700 bg-white rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-colors min-h-[44px]"
            >
              Try Breathing Exercise
            </a>
          </div>

          {/* Trust indicators */}
          <div className="mt-12 sm:mt-16 flex flex-wrap items-center gap-6 text-sm text-slate-500">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-sage-500" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
              </svg>
              Free &amp; private
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-sage-500" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
              </svg>
              Evidence-based techniques
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-sage-500" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
              </svg>
              No account required
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
