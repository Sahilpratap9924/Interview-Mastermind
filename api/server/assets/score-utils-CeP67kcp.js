function scoreColor(score) {
  if (score >= 9) return "var(--score-excellent)";
  if (score >= 7) return "var(--score-good)";
  if (score >= 4) return "var(--score-partial)";
  return "var(--score-poor)";
}
export {
  scoreColor as s
};
