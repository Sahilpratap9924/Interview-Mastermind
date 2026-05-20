export function scoreColor(score: number): string {
  if (score >= 9) return "var(--score-excellent)";
  if (score >= 7) return "var(--score-good)";
  if (score >= 4) return "var(--score-partial)";
  return "var(--score-poor)";
}
export function scoreLabel(score: number): string {
  if (score >= 9) return "Excellent";
  if (score >= 7) return "Good";
  if (score >= 4) return "Partial";
  return "Poor";
}
