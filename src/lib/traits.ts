import { type CharacterKey, type Lang, type Scores } from '../types';
import { maxRawPerChar } from './scoring';

// ─────────────────────────────────────────────────────────────────────────────
// Personality analytics. Each Straw Hat embodies certain traits; we project the
// user's accumulated character scores onto 8 dimensions and normalise each to
// 0–100 (relative to its own achievable max) for a well-spread radar.
// ─────────────────────────────────────────────────────────────────────────────

export type TraitKey =
  | 'leadership'
  | 'creativity'
  | 'loyalty'
  | 'intelligence'
  | 'courage'
  | 'adventure'
  | 'humor'
  | 'discipline';

export const TRAIT_KEYS: TraitKey[] = [
  'leadership',
  'creativity',
  'loyalty',
  'intelligence',
  'courage',
  'adventure',
  'humor',
  'discipline',
];

export const TRAIT_LABELS: Record<TraitKey, { en: string; ar: string }> = {
  leadership: { en: 'Leadership', ar: 'القيادة' },
  creativity: { en: 'Creativity', ar: 'الإبداع' },
  loyalty: { en: 'Loyalty', ar: 'الولاء' },
  intelligence: { en: 'Intelligence', ar: 'الذكاء' },
  courage: { en: 'Courage', ar: 'الشجاعة' },
  adventure: { en: 'Adventure', ar: 'المغامرة' },
  humor: { en: 'Humor', ar: 'المرح' },
  discipline: { en: 'Discipline', ar: 'الانضباط' },
};

const TRAIT_WEIGHTS: Record<TraitKey, Partial<Record<CharacterKey, number>>> = {
  leadership: { luffy: 3, jinbe: 2, zoro: 1, nami: 1, robin: 1 },
  creativity: { usopp: 3, franky: 3, nami: 1, robin: 1, brook: 1 },
  loyalty: { zoro: 3, sanji: 2, chopper: 2, jinbe: 2, luffy: 1 },
  intelligence: { robin: 3, nami: 3, jinbe: 1, chopper: 1, usopp: 1 },
  courage: { luffy: 3, zoro: 2, sanji: 2, usopp: 1, franky: 1 },
  adventure: { luffy: 3, franky: 2, robin: 2, brook: 1, nami: 1 },
  humor: { brook: 3, luffy: 2, usopp: 2, franky: 1, sanji: 1 },
  discipline: { zoro: 3, jinbe: 2, sanji: 1, robin: 1, nami: 1 },
};

export interface TraitValue {
  key: TraitKey;
  label: string;
  value: number; // 0–100
}

const clamp = (n: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, n));

export function computeTraits(scores: Scores, lang: Lang): TraitValue[] {
  return TRAIT_KEYS.map((key) => {
    const weights = TRAIT_WEIGHTS[key];
    let value = 0;
    let max = 0;
    for (const ck of Object.keys(weights) as CharacterKey[]) {
      const w = weights[ck] ?? 0;
      value += (scores[ck] ?? 0) * w;
      max += maxRawPerChar[ck] * w;
    }
    const pct = max > 0 ? clamp(Math.round((value / max) * 100), 0, 100) : 0;
    return { key, label: TRAIT_LABELS[key][lang], value: pct };
  });
}

/** Fun affinity meters derived from the trait profile. */
export interface Affinities {
  haki: number;
  devilFruit: number;
  crew: number;
}

export function computeAffinities(traits: TraitValue[]): Affinities {
  const get = (k: TraitKey) => traits.find((t) => t.key === k)?.value ?? 0;
  const avg = (...v: number[]) => Math.round(v.reduce((a, b) => a + b, 0) / v.length);
  return {
    haki: avg(get('courage'), get('discipline'), get('leadership')),
    devilFruit: avg(get('creativity'), get('adventure'), get('intelligence')),
    crew: avg(get('loyalty'), get('humor'), get('courage')),
  };
}
