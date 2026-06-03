/* eslint-disable react-refresh/only-export-components --
   Provider + hook are intentionally colocated. */
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { getQuestions, getUI, type UIStrings } from '../data/translations';
import { addScores, emptyScores, subtractScores } from '../lib/scoring';
import type { AnswerScore, Lang, Question, Scores } from '../types';

// ─────────────────────────────────────────────────────────────────────────────
// Quiz state, persisted to localStorage so a page reload restores progress
// (which question, accumulated scores, language, and whether the result is done).
// ─────────────────────────────────────────────────────────────────────────────

const STORAGE = 'op-quiz-v1';

interface Saved {
  lang: Lang;
  scores: Scores;
  index: number;
  history: AnswerScore[];
  completed: boolean;
}

function loadSaved(): Saved {
  const fallback: Saved = {
    lang: 'en',
    scores: emptyScores(),
    index: 0,
    history: [],
    completed: false,
  };
  try {
    const raw = localStorage.getItem(STORAGE);
    if (!raw) return fallback;
    const p = JSON.parse(raw) as Partial<Saved>;
    if (!p || typeof p.index !== 'number' || !p.scores) return fallback;
    return {
      lang: p.lang === 'ar' ? 'ar' : 'en',
      scores: { ...emptyScores(), ...p.scores },
      index: Math.max(0, p.index),
      history: Array.isArray(p.history) ? p.history : [],
      completed: !!p.completed,
    };
  } catch {
    return fallback;
  }
}

interface QuizApi {
  lang: Lang;
  scores: Scores;
  index: number;
  history: AnswerScore[];
  completed: boolean;
  questions: Question[];
  total: number;
  ui: UIStrings;
  isRtl: boolean;
  toggleLang: () => void;
  /** Record an answer; returns whether that was the final question. */
  answer: (s: AnswerScore) => { done: boolean };
  back: () => void;
  reset: () => void;
}

const QuizContext = createContext<QuizApi | null>(null);

export function QuizProvider({ children }: { children: ReactNode }) {
  const [{ lang, scores, index, history, completed }, setAll] = useState<Saved>(loadSaved);

  const questions = getQuestions(lang);
  const total = questions.length;
  const ui = getUI(lang);
  const isRtl = lang === 'ar';
  const safeIndex = Math.min(Math.max(0, index), total - 1);

  // Persist on every change.
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE, JSON.stringify({ lang, scores, index, history, completed }));
    } catch {
      /* ignore */
    }
  }, [lang, scores, index, history, completed]);

  // Reflect language on the document.
  useEffect(() => {
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
    document.title = lang === 'ar' ? 'اختبار شخصية ون بيس' : 'One Piece Personality Test';
  }, [isRtl, lang]);

  const api = useMemo<QuizApi>(
    () => ({
      lang,
      scores,
      index: safeIndex,
      history,
      completed,
      questions,
      total,
      ui,
      isRtl,
      toggleLang: () => setAll((s) => ({ ...s, lang: s.lang === 'en' ? 'ar' : 'en' })),
      answer: (s) => {
        const done = safeIndex >= total - 1;
        setAll((prev) => ({
          ...prev,
          scores: addScores(prev.scores, s),
          history: [...prev.history, s],
          index: done ? prev.index : prev.index + 1,
          completed: done ? true : prev.completed,
        }));
        return { done };
      },
      back: () =>
        setAll((prev) => {
          if (prev.index === 0 || prev.history.length === 0) return prev;
          const last = prev.history[prev.history.length - 1];
          return {
            ...prev,
            scores: subtractScores(prev.scores, last),
            history: prev.history.slice(0, -1),
            index: prev.index - 1,
          };
        }),
      reset: () =>
        setAll((prev) => ({
          ...prev,
          scores: emptyScores(),
          index: 0,
          history: [],
          completed: false,
        })),
    }),
    [lang, scores, safeIndex, history, completed, questions, total, ui, isRtl],
  );

  return <QuizContext.Provider value={api}>{children}</QuizContext.Provider>;
}

export function useQuiz(): QuizApi {
  const ctx = useContext(QuizContext);
  if (!ctx) throw new Error('useQuiz must be used within <QuizProvider>');
  return ctx;
}
