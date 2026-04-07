import { useMemo } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { DailyTip } from './components/DailyTip';
import { MoodCheckin } from './components/MoodCheckin';
import { BreathingExercise } from './components/BreathingExercise';
import { GroundingExercise } from './components/GroundingExercise';
import { CrisisResources } from './components/CrisisResources';
import { Footer } from './components/Footer';
import { ErrorBoundary } from './components/ErrorBoundary';
import { useScrollSpy } from './hooks/useScrollSpy';

const SECTION_IDS = ['mood', 'breathe', 'grounding', 'crisis'];

export function App() {
  const activeSection = useScrollSpy({ sectionIds: SECTION_IDS, offset: 120 });

  const navSectionIds = useMemo(() => SECTION_IDS, []);

  void navSectionIds; // used by scroll spy

  return (
    <div className="min-h-screen flex flex-col">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:z-[100] focus:px-4 focus:py-2 focus:bg-primary-500 focus:text-white focus:rounded-b-lg"
      >
        Skip to main content
      </a>
      <ErrorBoundary>
        <Header activeSection={activeSection} />
      </ErrorBoundary>
      <main id="main-content" className="flex-1">
        <ErrorBoundary>
          <Hero />
        </ErrorBoundary>
        <ErrorBoundary>
          <DailyTip />
        </ErrorBoundary>
        <ErrorBoundary>
          <MoodCheckin />
        </ErrorBoundary>
        <ErrorBoundary>
          <BreathingExercise />
        </ErrorBoundary>
        <ErrorBoundary>
          <GroundingExercise />
        </ErrorBoundary>
        <ErrorBoundary>
          <CrisisResources />
        </ErrorBoundary>
      </main>
      <ErrorBoundary>
        <Footer />
      </ErrorBoundary>
    </div>
  );
}
