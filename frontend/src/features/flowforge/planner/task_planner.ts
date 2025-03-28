import { detectMoodFromNote } from '../api/mood';

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


