import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { QuizFlow } from '../components/quiz/QuizFlow';
import { useQuiz } from '../context/quiz';
import { phaseTransition } from '../lib/motion';
import type { AnswerScore } from '../types';

export function QuizPage() {
  const { questions, index, total, lang, ui, isRtl, answer, back } = useQuiz();
  const navigate = useNavigate();

  const onAnswer = (scores: AnswerScore) => {
    const { done } = answer(scores);
    if (done) navigate('/result');
  };

  return (
    <motion.div variants={phaseTransition} initial="initial" animate="animate" exit="exit">
      <QuizFlow
        question={questions[index]}
        index={index}
        total={total}
        lang={lang}
        ui={ui}
        isRtl={isRtl}
        onAnswer={onAnswer}
        onBack={back}
      />
    </motion.div>
  );
}
