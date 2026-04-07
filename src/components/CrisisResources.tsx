interface Resource {
  name: string;
  phone: string;
  description: string;
  available: string;
}

const RESOURCES: Resource[] = [
  {
    name: '988 Suicide & Crisis Lifeline',
    phone: '988',
    description: 'Free, confidential support for people in distress. Call or text.',
    available: '24/7',
  },
  {
    name: 'Crisis Text Line',
    phone: 'Text HOME to 741741',
    description: 'Text-based support for any crisis. A live, trained counselor receives the text.',
    available: '24/7',
  },
  {
    name: 'SAMHSA National Helpline',
    phone: '1-800-662-4357',
    description: 'Treatment referrals, information services, and support for mental health and substance use.',
    available: '24/7, 365 days',
  },
  {
    name: 'The Trevor Project',
    phone: '1-866-488-7386',
    description: 'Crisis intervention and suicide prevention for LGBTQ+ young people.',
    available: '24/7',
  },
];

export function CrisisResources() {
  return (
    <section id="crisis" className="py-16 sm:py-24 bg-slate-50" aria-labelledby="crisis-heading">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-4 text-xs font-medium text-primary-700 bg-primary-100 rounded-full">
            <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
              <path d="M8 1a7 7 0 100 14A7 7 0 008 1zm0 13A6 6 0 118 2a6 6 0 010 12z"/>
              <path d="M8 4.5c-.83 0-1.5.67-1.5 1.5 0 .66.42 1.22 1 1.43V12h1V7.43c.58-.21 1-.77 1-1.43A1.5 1.5 0 008 4.5z"/>
            </svg>
            You are not alone
          </div>
          <h2
            id="crisis-heading"
            className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight"
          >
            Support is Always Available
          </h2>
          <p className="mt-2 text-base text-slate-500 max-w-xl mx-auto">
            If you or someone you know is in crisis, these free, confidential
            resources are here for you — anytime.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 max-w-3xl mx-auto">
          {RESOURCES.map((resource) => (
            <div
              key={resource.name}
              className="p-5 sm:p-6 bg-white border border-slate-200 rounded-2xl hover:shadow-sm transition-shadow"
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 text-primary-500" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/>
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-slate-900">{resource.name}</h3>
                  <p className="mt-1 text-lg font-bold text-primary-600">{resource.phone}</p>
                  <p className="mt-1 text-xs text-slate-500 leading-relaxed">{resource.description}</p>
                  <p className="mt-2 text-xs text-sage-700 font-medium">{resource.available}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <p className="mt-8 text-center text-xs text-slate-400">
          If you are in immediate danger, please call 911 or your local emergency services.
        </p>
      </div>
    </section>
  );
}
