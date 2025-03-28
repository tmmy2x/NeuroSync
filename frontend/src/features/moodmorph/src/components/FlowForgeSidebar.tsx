import { useState } from 'react';
import { planDayFromHistory, planDay } from '../Flowforge/planner/task_planner';

const FlowForgeSidebar = () => {
  const [mode, setMode] = useState<'smart' | 'manual'>('smart');
  const [journal, setJournal] = useState('');
  const suggestions = mode === 'smart' ? planDayFromHistory() : planDay(journal);

  return (
    <div className="fixed top-0 right-0 w-80 h-full bg-gray-900 text-white p-4 border-l border-gray-700 shadow-lg overflow-y-auto z-40">
      <h2 className="text-xl font-bold mb-4">🧠 FlowForge Planner</h2>

      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setMode('smart')}
          className={`px-3 py-1 rounded ${
            mode === 'smart' ? 'bg-blue-600' : 'bg-gray-700'
          }`}
        >
          Smart Mode
        </button>
        <button
          onClick={() => setMode('manual')}
          className={`px-3 py-1 rounded ${
            mode === 'manual' ? 'bg-blue-600' : 'bg-gray-700'
          }`}
        >
          Manual Mode
        </button>
      </div>

      {mode === 'manual' && (
        <div className="mb-4">
          <textarea
            value={journal}
            onChange={(e) => setJournal(e.target.value)}
            placeholder="Describe how you're feeling..."
            className="w-full p-2 rounded bg-gray-800 text-white"
            rows={4}
          />
        </div>
      )}

      <h3 className="font-semibold text-lg mb-2">Suggested Tasks</h3>
      <ul className="list-disc pl-6 space-y-1 text-sm">
        {suggestions.map((task, idx) => (
          <li key={idx}>{task}</li>
        ))}
      </ul>
    </div>
  );
};

export default FlowForgeSidebar;
