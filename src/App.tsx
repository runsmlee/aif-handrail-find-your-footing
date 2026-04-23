import React, { lazy, Suspense } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { DailyProgress } from './components/DailyProgress';
import { ScrollToTop } from './components/ScrollToTop';
import { ErrorBoundary } from './components/ErrorBoundary';
import { useScrollSpy } from './hooks/useScrollSpy';
import { useTheme } from './hooks/useTheme';
import { useMoodHistory } from './hooks/useMoodHistory';
import { useDailyProgress } from './hooks/useDailyProgress';

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

function SectionLoader(): React.ReactElement {
  return (
    <div className="flex items-center justify-center py-24" aria-hidden="true">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-primary-200 border-t-primary-500 rounded-full animate-spin" />
        <span className="text-sm text-slate-400">Loading...</span>
      </div>
    </div>
  );
}

const SECTION_IDS = ['mood', 'breathe', 'mindfulness', 'grounding', 'gratitude', 'crisis'];

export function App() {
  const activeSection = useScrollSpy({ sectionIds: SECTION_IDS, offset: 120 });
  const { theme, toggleTheme } = useTheme();
  const { history, addEntry, clearHistory, streak } = useMoodHistory();
  const { activity, markMoodCheckedIn, updateChecklistProgress, markBreathingDone, markGratitudeDone, markMindfulnessDone } = useDailyProgress();

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
          <Hero streak={streak} />
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
