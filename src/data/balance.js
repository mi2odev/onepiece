// Normalization weight factors to balance over-represented characters.
// Derived from current total potential contributions distribution.
// targetAverage ≈ 56.8 (mean of raw aggregate appearances/points across answer set).
// weight = targetAverage / rawTotal so that adjustedTotal ≈ targetAverage for each.
// These are applied multiplicatively to raw accumulated scores at result time.
export const scoreWeights = {
  luffy: 0.653,   // was heavily over-represented
  zoro: 0.931,
  nami: 1.092,
  sanji: 1.291,
  usopp: 1.352,
  chopper: 0.963,
  robin: 0.789,
  franky: 1.721,  // most under-represented
  brook: 0.947,
  jinbe: 0.979
};

// Max per character after weighting (24 questions * 3 max points * weight)
export const maxWeightedPerCharacter = Object.fromEntries(
  Object.entries(scoreWeights).map(([k, w]) => [k, 24 * 3 * w])
);

// Helper to apply weights and produce ranking-friendly structure
export function applyScoreWeights(rawScores) {
  const adjusted = {};
  for (const k of Object.keys(scoreWeights)) {
    const raw = rawScores[k] || 0;
    adjusted[k] = raw * scoreWeights[k];
  }
  return adjusted;
}