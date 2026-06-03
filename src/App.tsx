import { useEffect, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { Background } from './components/background/Background';
import { IntroSequence } from './components/intro/IntroSequence';
import Footer from './components/Footer';
import { SoundProvider } from './hooks/useSound';
import { QuizProvider, useQuiz } from './context/quiz';
import { HeroPage } from './pages/HeroPage';
import { QuizPage } from './pages/QuizPage';
import { ResultPage } from './pages/ResultPage';

function AppShell() {
  const location = useLocation();
  const { ui, isRtl } = useQuiz();
  const onHome = location.pathname === '/';
  const [introDone, setIntroDone] = useState(false);

  // The cinematic intro plays whenever we land on / (including a reload of /).
  useEffect(() => {
    if (onHome) setIntroDone(false);
  }, [onHome]);

  return (
    <div className="relative min-h-[100dvh] overflow-x-hidden">
      <Background />

      <div className="relative z-10">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route index element={<HeroPage />} />
            <Route path="quiz" element={<QuizPage />} />
            <Route path="result" element={<ResultPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AnimatePresence>
      </div>

      <Footer />

      <AnimatePresence>
        {onHome && !introDone && (
          <IntroSequence
            onDone={() => setIntroDone(true)}
            tagline={ui.introTagline}
            skipLabel={ui.skip}
            isRtl={isRtl}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default function App() {
  return (
    <SoundProvider>
      <QuizProvider>
        <AppShell />
      </QuizProvider>
    </SoundProvider>
  );
}
