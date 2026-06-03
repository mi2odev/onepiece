import { lazy, Suspense } from 'react';
import { motion } from 'framer-motion';
import { Navigate, useNavigate } from 'react-router-dom';
import { useQuiz } from '../context/quiz';
import { phaseTransition } from '../lib/motion';

// Result page (with recharts) is code-split — keeps the hero/quiz load light.
const ResultReveal = lazy(() =>
  import('../components/result/ResultReveal').then((m) => ({ default: m.ResultReveal })),
);

export function ResultPage() {
  const { scores, completed, lang, ui, isRtl, reset } = useQuiz();
  const navigate = useNavigate();

  // No finished quiz to show → send them home.
  if (!completed) return <Navigate to="/" replace />;

  const onRestart = () => {
    reset();
    navigate('/');
  };

  return (
    <motion.div variants={phaseTransition} initial="initial" animate="animate" exit="exit">
      <Suspense
        fallback={
          <div className="flex min-h-[100dvh] items-center justify-center">
            <div className="h-12 w-12 animate-spin-slow rounded-full border-2 border-gold/30 border-t-gold" />
          </div>
        }
      >
        <ResultReveal scores={scores} lang={lang} ui={ui} isRtl={isRtl} onRestart={onRestart} />
      </Suspense>
    </motion.div>
  );
}
