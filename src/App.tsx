import { lazy, Suspense, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Background } from './components/background/Background';
import { Hero } from './components/hero/Hero';
import { QuizFlow } from './components/quiz/QuizFlow';
import Footer from './components/Footer';

// Result page (with recharts) is code-split — keeps the hero/quiz load light.
const ResultReveal = lazy(() =>
  import('./components/result/ResultReveal').then((m) => ({ default: m.ResultReveal })),
);
import { SoundProvider, useSound } from './hooks/useSound';
import { getQuestions, getUI } from './data/translations';
import { phaseTransition } from './lib/motion';
import { addScores, emptyScores, subtractScores } from './lib/scoring';
import type { AnswerScore, AppPhase, Lang, Scores } from './types';

function AppInner() {
  const [phase, setPhase] = useState<AppPhase>('hero');
  const [lang, setLang] = useState<Lang>('en');
  const [scores, setScores] = useState<Scores>(emptyScores);
  const [index, setIndex] = useState(0);
  const [history, setHistory] = useState<AnswerScore[]>([]);
  const { play } = useSound();

  const ui = getUI(lang);
  const isRtl = lang === 'ar';
  const questions = getQuestions(lang);
  const total = questions.length;

  useEffect(() => {
    document.title = lang === 'ar' ? 'اختبار شخصية ون بيس' : 'One Piece Personality Test';
  }, [lang]);

  useEffect(() => {
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [isRtl, lang]);

  const toggleLang = () => setLang((p) => (p === 'en' ? 'ar' : 'en'));

  const reset = () => {
    setIndex(0);
    setScores(emptyScores());
    setHistory([]);
  };

  const beginJourney = () => {
    reset();
    play('sail');
    setPhase('quiz');
  };

  const restart = () => {
    reset();
    setPhase('hero');
  };

  const handleAnswer = (answerScores: AnswerScore) => {
    setScores((s) => addScores(s, answerScores));
    setHistory((h) => [...h, answerScores]);
    if (index < total - 1) {
      setIndex((i) => i + 1);
    } else {
      play('success');
      setPhase('result');
    }
  };

  const handleBack = () => {
    if (index === 0 || history.length === 0) return;
    const last = history[history.length - 1];
    setScores((s) => subtractScores(s, last));
    setHistory((h) => h.slice(0, -1));
    setIndex((i) => i - 1);
  };

  return (
    <div className="relative min-h-[100dvh] overflow-x-hidden">
      <Background />

      <div className="relative z-10">
        <AnimatePresence mode="wait">
          {phase === 'hero' && (
            <motion.div key="hero" variants={phaseTransition} initial="initial" animate="animate" exit="exit">
              <Hero ui={ui} lang={lang} isRtl={isRtl} onToggleLang={toggleLang} onBegin={beginJourney} />
            </motion.div>
          )}

          {phase === 'quiz' && (
            <motion.div key="quiz" variants={phaseTransition} initial="initial" animate="animate" exit="exit">
              <QuizFlow
                question={questions[index]}
                index={index}
                total={total}
                lang={lang}
                ui={ui}
                isRtl={isRtl}
                onAnswer={handleAnswer}
                onBack={handleBack}
              />
            </motion.div>
          )}

          {phase === 'result' && (
            <motion.div key="result" variants={phaseTransition} initial="initial" animate="animate" exit="exit">
              <Suspense
                fallback={
                  <div className="flex min-h-[100dvh] items-center justify-center">
                    <div className="h-12 w-12 animate-spin-slow rounded-full border-2 border-gold/30 border-t-gold" />
                  </div>
                }
              >
                <ResultReveal scores={scores} lang={lang} ui={ui} isRtl={isRtl} onRestart={restart} />
              </Suspense>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <SoundProvider>
      <AppInner />
    </SoundProvider>
  );
}
