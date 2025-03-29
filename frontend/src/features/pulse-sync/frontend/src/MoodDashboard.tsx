import React from 'react';

const MoodDashboard = ({ mood, nudge }: { mood: string; nudge?: string }) => (
    <div className="mt-4 p-4 rounded bg-white shadow">
      <p className="text-lg font-semibold">Current Mood:</p>
      <p className="text-2xl text-indigo-600">{mood}</p>
      {nudge && (
        <p className="mt-2 text-sm text-gray-700">
          🧘 Wellness Nudge: <strong>{nudge}</strong>
        </p>
      )}
    </div>
  );
  
  
  export default MoodDashboard;
  