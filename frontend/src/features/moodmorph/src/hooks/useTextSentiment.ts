import Sentiment from 'sentiment';

const sentiment = new Sentiment();

export const analyzeTextMood = (text: string): 'power' | 'focus' | 'calm' | 'restore' => {
  const result = sentiment.analyze(text);
  const score = result.score;

  if (score > 2) return 'power';
  if (score >= 0) return 'focus';
  if (score >= -3) return 'calm';
  return 'restore';
};
