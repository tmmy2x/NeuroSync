import { analyzeMoodFromText } from '../ai/text_sentiment';
import { saveEmotion } from '../db/emotion_logger'; // ← We'll create this

export const detectMoodFromNote = (note: string) => {
  const result = analyzeMoodFromText(note);
  saveEmotion(result.mood, 'text_sentiment');
  return result;
};
