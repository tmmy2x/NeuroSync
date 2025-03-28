type Emotion = 'focus' | 'calm' | 'power' | 'restore';

interface EmotionLog {
  emotion: Emotion;
  source: string;
  timestamp: number;
}

// Save emotion to localStorage
export function saveEmotion(emotion: Emotion, source: string) {
  const logs: EmotionLog[] = JSON.parse(localStorage.getItem('emotion_logs') || '[]');
  logs.push({ emotion, source, timestamp: Date.now() });
  localStorage.setItem('emotion_logs', JSON.stringify(logs));
}

// Retrieve all saved emotions
export function getEmotionLogs(): EmotionLog[] {
  return JSON.parse(localStorage.getItem('emotion_logs') || '[]');
}
