import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Hero } from '../components/hero/Hero';
import { useQuiz } from '../context/quiz';
import { useSound } from '../hooks/useSound';
import { phaseTransition } from '../lib/motion';

export function HeroPage() {
  const { ui, lang, isRtl, toggleLang, reset } = useQuiz();
  const { play } = useSound();
  const navigate = useNavigate();

  const begin = () => {
    reset();
    play('sail');
    navigate('/quiz');
  };

  return (
    <motion.div variants={phaseTransition} initial="initial" animate="animate" exit="exit">
      <Hero ui={ui} lang={lang} isRtl={isRtl} onToggleLang={toggleLang} onBegin={begin} />
    </motion.div>
  );
}
