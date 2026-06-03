import { useRef, useState } from 'react';
import { AnimatePresence, motion, type Variants } from 'framer-motion';
import type { AnswerScore, Lang, Question } from '../../types';
import type { UIStrings } from '../../data/translations';
import { useReducedMotionSafe } from '../../hooks/useReducedMotionSafe';
import { useSound } from '../../hooks/useSound';
import { easeOutSoft } from '../../lib/motion';
import { ParchmentCard } from './ParchmentCard';
import { AnswerCard } from './AnswerCard';
import { GrandLineMap } from './GrandLineMap';
import { SailTransition } from './SailTransition';

interface QuizFlowProps {
  question: Question;
  index: number; // 0-based
  total: number;
  lang: Lang;
  ui: UIStrings;
  isRtl: boolean;
  onAnswer: (scores: AnswerScore) => void;
  onBack: () => void;
}

export function QuizFlow({
  question,
  index,
  total,
  lang,
  ui,
  isRtl,
  onAnswer,
  onBack,
}: QuizFlowProps) {
  const [direction, setDirection] = useState(1);

  const handleAnswer = (scores: AnswerScore) => {
    setDirection(1);
    onAnswer(scores);
  };
  const handleBack = () => {
    setDirection(-1);
    onBack();
  };

  return (
    <div
      className={`relative flex min-h-[100dvh] flex-col px-4 pb-28 pt-6 sm:pt-8 ${isRtl ? 'font-ui' : ''}`}
    >
      <div className="mx-auto w-full max-w-3xl">
        <GrandLineMap current={index + 1} total={total} lang={lang} />

        <div className="mt-4 flex justify-start" dir={isRtl ? 'rtl' : 'ltr'}>
          <button
            type="button"
            onClick={handleBack}
            disabled={index === 0}
            className="glass inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-cloud/80 transition-colors hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <span aria-hidden>{isRtl ? '→' : '←'}</span>
            {ui.back}
          </button>
        </div>
      </div>

      <div className="relative mx-auto mt-5 w-full max-w-3xl flex-1">
        <SailTransition key={`sail-${question.id}`} />
        <AnimatePresence mode="wait" custom={direction}>
          <QuestionPanel
            key={question.id}
            question={question}
            number={index + 1}
            ui={ui}
            direction={direction}
            onAnswer={handleAnswer}
          />
        </AnimatePresence>
      </div>
    </div>
  );
}

interface QuestionPanelProps {
  question: Question;
  number: number; // 1-based
  ui: UIStrings;
  direction: number;
  onAnswer: (scores: AnswerScore) => void;
}

function QuestionPanel({ question, number, ui, direction, onAnswer }: QuestionPanelProps) {
  const reduce = useReducedMotionSafe();
  const { play } = useSound();
  const [selected, setSelected] = useState<number | null>(null);
  const lockRef = useRef(false);

  const select = (i: number) => {
    if (lockRef.current) return;
    lockRef.current = true;
    setSelected(i);
    play('haki');
    window.setTimeout(() => onAnswer(question.answers[i].scores), reduce ? 0 : 460);
  };

  const variants: Variants = {
    initial: (d: number) =>
      reduce ? { opacity: 0 } : { x: d >= 0 ? 90 : -90, opacity: 0, rotate: d >= 0 ? 1.2 : -1.2 },
    animate: {
      x: 0,
      opacity: 1,
      rotate: -0.6,
      transition: { duration: reduce ? 0.2 : 0.5, ease: easeOutSoft },
    },
    exit: (d: number) =>
      reduce
        ? { opacity: 0, transition: { duration: 0.15 } }
        : {
            x: d >= 0 ? -110 : 110,
            opacity: 0,
            rotate: d >= 0 ? -2.6 : 2.6,
            transition: { duration: 0.45, ease: easeOutSoft },
          },
  };

  return (
    <motion.div
      custom={direction}
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <ParchmentCard>
        <div className="mb-5 flex justify-center">
          <span className="rounded-full border border-amber-700/40 bg-amber-900/10 px-4 py-1 font-display text-[0.7rem] font-bold uppercase tracking-[0.2em] text-amber-800">
            {ui.questionUpper} {number}
          </span>
        </div>
        <h2 className="text-center font-display text-xl font-black leading-snug text-amber-950 sm:text-2xl md:text-3xl">
          {question.question}
        </h2>
      </ParchmentCard>

      <div className="mx-auto mt-6 grid w-full max-w-2xl grid-cols-1 gap-3 sm:mt-8 sm:grid-cols-2 sm:gap-4">
        {question.answers.map((answer, i) => (
          <AnswerCard
            key={i}
            index={i}
            text={answer.text}
            selected={selected === i}
            disabled={selected !== null}
            onSelect={() => select(i)}
          />
        ))}
      </div>
    </motion.div>
  );
}
