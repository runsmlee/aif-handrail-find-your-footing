import React, { lazy, Suspense, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { DailyProgress } from './components/DailyProgress';
import { ScrollToTop } from './components/ScrollToTop';
import { ErrorBoundary } from './components/ErrorBoundary';
import { useScrollSpy } from './hooks/useScrollSpy';
import { useTheme } from './hooks/useTheme';
import { useMoodHistory } from './hooks/useMoodHistory';
import { useDailyProgress } from './hooks/useDailyProgress';
import { trackEvent } from './utils/analytics';

// Lazy load heavy sections to reduce initial bundle
const DailySummary = lazy(() =>
  import('./components/DailySummary').then(m => ({ default: m.DailySummary }))
);
const DailyTip = lazy(() =>
  import('./components/DailyTip').then(m => ({ default: m.DailyTip }))
);
const QuickActions = lazy(() =>
  import('./components/QuickActions').then(m => ({ default: m.QuickActions }))
);
const MoodCheckin = lazy(() =>
  import('./components/MoodCheckin').then(m => ({ default: m.MoodCheckin }))
);
const WellnessChecklist = lazy(() =>
  import('./components/WellnessChecklist').then(m => ({ default: m.WellnessChecklist }))
);
const MoodInsights = lazy(() =>
  import('./components/MoodInsights').then(m => ({ default: m.MoodInsights }))
);
const BreathingExercise = lazy(() =>
  import('./components/BreathingExercise').then(m => ({ default: m.BreathingExercise }))
);
const MindfulnessTimer = lazy(() =>
  import('./components/MindfulnessTimer').then(m => ({ default: m.MindfulnessTimer }))
);
const GroundingExercise = lazy(() =>
  import('./components/GroundingExercise').then(m => ({ default: m.GroundingExercise }))
);
const GratitudeJournal = lazy(() =>
  import('./components/GratitudeJournal').then(m => ({ default: m.GratitudeJournal }))
);
const CrisisResources = lazy(() =>
  import('./components/CrisisResources').then(m => ({ default: m.CrisisResources }))
);
const Footer = lazy(() =>
  import('./components/Footer').then(m => ({ default: m.Footer }))
);
const WelcomeOnboarding = lazy(() =>
  import('./components/WelcomeOnboarding').then(m => ({ default: m.WelcomeOnboarding }))
);

function SkeletonPulse(): React.ReactElement {
  return (
    <div className="space-y-6 py-12 sm:py-16 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8" aria-hidden="true">
      {/* Section title skeleton */}
      <div className="text-center space-y-3">
        <div className="h-8 w-48 bg-slate-200 dark:bg-slate-700 rounded-lg mx-auto animate-pulse" />
        <div className="h-4 w-64 bg-slate-100 dark:bg-slate-700 rounded mx-auto animate-pulse" />
      </div>
      {/* Content block skeleton */}
      <div className="max-w-lg mx-auto space-y-4">
        <div className="h-20 bg-slate-100 dark:bg-slate-700/60 rounded-2xl animate-pulse" />
        <div className="h-20 bg-slate-100 dark:bg-slate-700/60 rounded-2xl animate-pulse" />
        <div className="h-12 w-32 bg-slate-100 dark:bg-slate-700/60 rounded-xl mx-auto animate-pulse" />
      </div>
    </div>
  );
}

function SectionLoader(): React.ReactElement {
  return <SkeletonPulse />;
}

const SECTION_IDS = ['mood', 'breathe', 'mindfulness', 'grounding', 'gratitude', 'crisis'];

export function App() {
  const activeSection = useScrollSpy({ sectionIds: SECTION_IDS, offset: 120 });
  const { theme, toggleTheme } = useTheme();
  const { history, addEntry, clearHistory, streak } = useMoodHistory();
  const { activity, markMoodCheckedIn, updateChecklistProgress, markBreathingDone, markGratitudeDone, markMindfulnessDone } = useDailyProgress();

  // Track page view on mount
  useEffect(() => {
    trackEvent('page_view', { path: window.location.pathname });
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:z-[100] focus:px-4 focus:py-2 focus:bg-primary-500 focus:text-white focus:rounded-b-lg"
      >
        Skip to main content
      </a>

      {/* Onboarding modal for first-time users */}
      <ErrorBoundary>
        <Suspense fallback={null}>
          <WelcomeOnboarding />
        </Suspense>
      </ErrorBoundary>

      <ErrorBoundary>
        <Header activeSection={activeSection} theme={theme} onToggleTheme={toggleTheme} />
      </ErrorBoundary>
      <main id="main-content" className="flex-1">
        <ErrorBoundary>
          <Hero streak={streak} onBreathingComplete={markBreathingDone} />
        </ErrorBoundary>
        <ErrorBoundary>
          <Suspense fallback={<SectionLoader />}>
            <DailySummary />
          </Suspense>
        </ErrorBoundary>
        <ErrorBoundary>
          <DailyProgress
            moodCheckedIn={activity.moodCheckedIn}
            checklistProgress={activity.checklistProgress}
            checklistTotal={activity.checklistTotal}
            breathingDone={activity.breathingDone}
            mindfulnessDone={activity.mindfulnessDone}
            gratitudeDone={activity.gratitudeDone}
          />
        </ErrorBoundary>
        <ErrorBoundary>
          <Suspense fallback={<SectionLoader />}>
            <DailyTip />
          </Suspense>
        </ErrorBoundary>
        <ErrorBoundary>
          <Suspense fallback={<SectionLoader />}>
            <QuickActions />
          </Suspense>
        </ErrorBoundary>
        <ErrorBoundary>
          <Suspense fallback={<SectionLoader />}>
            <MoodCheckin
              onMoodCheckedIn={markMoodCheckedIn}
              sharedAddEntry={addEntry}
              sharedHistory={history}
              sharedClearHistory={clearHistory}
            />
          </Suspense>
        </ErrorBoundary>
        <ErrorBoundary>
          <Suspense fallback={<SectionLoader />}>
            <MoodInsights history={history} />
          </Suspense>
        </ErrorBoundary>
        <ErrorBoundary>
          <Suspense fallback={<SectionLoader />}>
            <WellnessChecklist onProgressChange={updateChecklistProgress} />
          </Suspense>
        </ErrorBoundary>
        <ErrorBoundary>
          <Suspense fallback={<SectionLoader />}>
            <BreathingExercise onComplete={markBreathingDone} />
          </Suspense>
        </ErrorBoundary>
        <ErrorBoundary>
          <Suspense fallback={<SectionLoader />}>
            <MindfulnessTimer onComplete={markMindfulnessDone} />
          </Suspense>
        </ErrorBoundary>
        <ErrorBoundary>
          <Suspense fallback={<SectionLoader />}>
            <GroundingExercise />
          </Suspense>
        </ErrorBoundary>
        <ErrorBoundary>
          <Suspense fallback={<SectionLoader />}>
            <GratitudeJournal onEntrySaved={markGratitudeDone} />
          </Suspense>
        </ErrorBoundary>
        <ErrorBoundary>
          <Suspense fallback={<SectionLoader />}>
            <CrisisResources />
          </Suspense>
        </ErrorBoundary>
      </main>
      <ErrorBoundary>
        <Suspense fallback={<SectionLoader />}>
          <Footer />
        </Suspense>
      </ErrorBoundary>
      <ScrollToTop />
    </div>
  );
}
