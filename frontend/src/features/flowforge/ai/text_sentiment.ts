import Sentiment from 'sentiment';

const sentiment = new Sentiment();

export type SentimentResult = {
  mood: 'restore' | 'calm' | 'focus' | 'power';
  score: number;
};

export function analyzeMoodFromText(text: string): SentimentResult {
  const { score } = sentiment.analyze(text);

  if (score > 2) return { mood: 'power', score };
  if (score >= 0) return { mood: 'focus', score };
  if (score >= -3) return { mood: 'calm', score };
  return { mood: 'restore', score };
}