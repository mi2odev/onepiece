import { CHARACTER_KEYS, type AnswerScore, type CharacterKey, type Scores } from '../types';
import { questions } from '../data/questions';

// ─────────────────────────────────────────────────────────────────────────────
// Scoring + ranking.
//
// Some characters (notably Luffy) appear in far more answers than others, so
// raw totals are biased. We correct this with per-character weights and rank by
// the *weighted* score. Percentages use a common denominator (the average
// achievable weighted max) so the display order matches the ranking and the top
// match lands in a satisfying, high range.
// ─────────────────────────────────────────────────────────────────────────────

export const scoreWeights: Record<CharacterKey, number> = {
  luffy: 0.653,
  zoro: 0.931,
  nami: 1.092,
  sanji: 1.291,
  usopp: 1.352,
  chopper: 0.963,
  robin: 0.789,
  franky: 1.721,
  brook: 0.947,
  jinbe: 0.979,
};

export const emptyScores = (): Scores =>
  Object.fromEntries(CHARACTER_KEYS.map((k) => [k, 0])) as Scores;

export function addScores(base: Scores, add: AnswerScore): Scores {
  const next = { ...base };
  for (const key of Object.keys(add) as CharacterKey[]) {
    next[key] += add[key] ?? 0;
  }
  return next;
}

export function subtractScores(base: Scores, sub: AnswerScore): Scores {
  const next = { ...base };
  for (const key of Object.keys(sub) as CharacterKey[]) {
    next[key] = Math.max(0, next[key] - (sub[key] ?? 0));
  }
  return next;
}

// Per-character maximum achievable RAW score, derived from the question data:
// for each question, the highest score that character can earn in any single
// answer, summed across all questions.
export const maxRawPerChar: Record<CharacterKey, number> = (() => {
  const max = emptyScores();
  for (const q of questions) {
    for (const key of CHARACTER_KEYS) {
      let best = 0;
      for (const a of q.answers) {
        const v = (a.scores as AnswerScore)[key] ?? 0;
        if (v > best) best = v;
      }
      max[key] += best;
    }
  }
  return max;
})();

const maxWeightedPerChar: Record<CharacterKey, number> = Object.fromEntries(
  CHARACTER_KEYS.map((k) => [k, maxRawPerChar[k] * scoreWeights[k]]),
) as Record<CharacterKey, number>;

const avgMaxWeighted =
  CHARACTER_KEYS.reduce((sum, k) => sum + maxWeightedPerChar[k], 0) / CHARACTER_KEYS.length;

export interface RankedCharacter {
  key: CharacterKey;
  raw: number;
  weighted: number;
  /** 0–99 match strength, common denominator so order == ranking. */
  percentage: number;
  rank: number; // 1-based
}

const clamp = (n: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, n));

export function computeRanking(scores: Scores): RankedCharacter[] {
  const rows = CHARACTER_KEYS.map((key) => {
    const raw = scores[key] ?? 0;
    const weighted = raw * scoreWeights[key];
    const percentage = clamp(Math.round((weighted / avgMaxWeighted) * 100), 0, 99);
    return { key, raw, weighted, percentage };
  });
  rows.sort((a, b) => b.weighted - a.weighted);
  return rows.map((r, i) => ({ ...r, rank: i + 1 }));
}

export const topCharacter = (scores: Scores): CharacterKey => computeRanking(scores)[0].key;

/** A flavourful bounty in berries scaled by match strength. */
export function bountyFor(percentage: number): number {
  return Math.round(500 + percentage * 35) * 1_000_000;
}

export function formatBounty(n: number): string {
  return n.toLocaleString('en-US');
}
