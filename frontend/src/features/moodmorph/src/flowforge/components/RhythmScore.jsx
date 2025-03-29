export default function RhythmScore({ blocks }) {
    const focusCount = blocks.filter(b => b.type === 'deep').length
    const meetingCount = blocks.filter(b => b.type === 'meeting').length
  
    return (
      <div className="flex gap-6 text-sm text-gray-700 mb-2">
        <div>🎯 Focus Blocks: <strong>{focusCount}</strong></div>
        <div>🧑‍🤝‍🧑 Meetings: <strong>{meetingCount}</strong></div>
      </div>
    )
  }
  