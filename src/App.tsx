import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { MoodCheckin } from './components/MoodCheckin';
import { BreathingExercise } from './components/BreathingExercise';
import { GroundingExercise } from './components/GroundingExercise';
import { CrisisResources } from './components/CrisisResources';
import { Footer } from './components/Footer';

export function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:z-[100] focus:px-4 focus:py-2 focus:bg-primary-500 focus:text-white focus:rounded-b-lg"
      >
        Skip to main content
      </a>
      <Header />
      <main id="main-content" className="flex-1">
        <Hero />
        <MoodCheckin />
        <BreathingExercise />
        <GroundingExercise />
        <CrisisResources />
      </main>
      <Footer />
    </div>
  );
}
