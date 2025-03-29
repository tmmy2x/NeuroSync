import { detectMoodFromNote } from '../api/mood';
import { fileSave } from "browser-fs-access";
import path from "path-browserify";

export const planDay = (journal: string) => {
  const { mood } = detectMoodFromNote(journal);

  switch (mood) {
    case 'power':
      return recommendHighOutputTasks();
    case 'focus':
      return recommendDeepWorkBlocks();
    case 'calm':
      return recommendSupportiveTasks();
    case 'restore':
      return recommendLowLoadRecoveryTasks();
  }
};

function recommendHighOutputTasks() {
  return [
    'Complete project report',
    'Prepare presentation for client meeting',
    'Finish coding new feature',
    'Review and merge pull requests',
  ];
}
function recommendDeepWorkBlocks() {
  return [
    'Write technical documentation',
    'Develop new algorithm',
    'Refactor existing codebase',
    'Conduct code review'
  ];
}
// function recommendDeepWorkBlocks() {
//   throw new Error('Function not implemented.');
// }
  ;

function recommendSupportiveTasks() {
  return [
    'Update project documentation',
    'Assist team members with their tasks',
    'Attend team meetings'
  ];
}
function recommendLowLoadRecoveryTasks() {
  return [
    'Go for a short walk',
    'Organize your workspace',
    'Listen to relaxing music',
    'Review notes and reflect on the week',
  ];
}




import { getEmotionLogs } from '../db/emotion_logger';

export const planDayFromHistory = () => {
  const logs = getEmotionLogs();
  if (logs.length === 0) return ['Start with a light planning session'];

  const recent = logs.slice(-5);
  const moodCounts: Record<string, number> = {};

  recent.forEach(({ emotion }) => {
    moodCounts[emotion] = (moodCounts[emotion] || 0) + 1;
  });

  const dominantMood = Object.entries(moodCounts).sort((a, b) => b[1] - a[1])[0][0];

  switch (dominantMood) {
    case 'power':
      return recommendHighOutputTasks();
    case 'focus':
      return recommendDeepWorkBlocks();
    case 'calm':
      return recommendSupportiveTasks();
    case 'restore':
      return recommendLowLoadRecoveryTasks();
    default:
      return ['Start with a calm reflection'];
  }
};

// Analyze journal text and infer emotion
function analyzeEmotionFromText(text: string): string {
  const lowered = text.toLowerCase();

  if (lowered.includes("tired") || lowered.includes("exhausted")) return "tired";
  if (lowered.includes("excited") || lowered.includes("energized")) return "energized";
  if (lowered.includes("stressed") || lowered.includes("anxious")) return "anxious";
  if (lowered.includes("focused")) return "focused";

  return "calm";
}

// Save emotion to shared/emotion_state.json
function saveEmotionToFile(emotion: string, source = "journal_text") {
  const payload = {
    emotion,
    source,
    timestamp: new Date().toISOString()
  };

  const filePath = path.join("./shared/emotion_state.json");

  try {
    fileSave(new Blob([JSON.stringify(payload, null, 2)]), {
      fileName: "emotion_state.json",
    });
    console.log(`[MoodMorph] Emotion saved: ${emotion}`);
  } catch (err) {
    console.error("[MoodMorph] Failed to save emotion:", err);
  }
}

// Main exported function
export function planDayFromJournal(journal: string): string[] {
  const emotion = analyzeEmotionFromText(journal);
  saveEmotionToFile(emotion, "journal_text");

  // Sample task suggestions based on emotion
  switch (emotion) {
    case "tired":
      return ["Clear Inbox", "Read Documentation", "File Cleanup"];
    case "energized":
      return ["Launch Campaign", "Deep Work Sprint", "Strategic Planning"];
    case "anxious":
      return ["Knock Out Quick Wins", "Declutter Workspace", "Reset Walk"];
    case "focused":
      return ["Complete Feature X", "Draft Blog Post", "Optimize Workflow"];
    default:
      return ["Plan Tomorrow", "Review Notes", "Skim Articles"];
  }
}

