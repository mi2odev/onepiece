// ─────────────────────────────────────────────────────────────────────────────
// Core domain types — shared across the whole app.
// ─────────────────────────────────────────────────────────────────────────────

export type CharacterKey =
  | 'luffy'
  | 'zoro'
  | 'nami'
  | 'sanji'
  | 'usopp'
  | 'chopper'
  | 'robin'
  | 'franky'
  | 'brook'
  | 'jinbe';

/** Canonical ordering used for iteration / fallbacks. */
export const CHARACTER_KEYS: CharacterKey[] = [
  'luffy',
  'zoro',
  'nami',
  'sanji',
  'usopp',
  'chopper',
  'robin',
  'franky',
  'brook',
  'jinbe',
];

export type Lang = 'en' | 'ar';

/** Answer score objects in the data are partial — never all 10 keys. */
export type AnswerScore = Partial<Record<CharacterKey, number>>;

export interface Answer {
  text: string;
  scores: AnswerScore;
}

export interface Question {
  id: number;
  question: string;
  answers: Answer[];
}

export interface Character {
  name: string;
  title: string;
  description: string;
  traits: string[];
  color: string;
  image: string;
  emoji: string;
}

export type CharacterMap = Record<CharacterKey, Character>;

/** The live accumulator is always full (all 10 keys initialised to 0). */
export type Scores = Record<CharacterKey, number>;

export type AppPhase = 'hero' | 'quiz' | 'result';
