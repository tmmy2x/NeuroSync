// src/components/ModeSwitcher.tsx
import React from 'react';

type Mode = 'focus' | 'calm' | 'power' | 'restore';

interface Props {
  currentMode: Mode;
  setMode: (mode: Mode) => void;
}

const modes: Mode[] = ['focus', 'calm', 'power', 'restore'];

const ModeSwitcher: React.FC<Props> = ({ currentMode, setMode }) => {
  return (
    <div className="p-4 flex justify-center gap-4">
      {modes.map((mode) => (
        <button
          key={mode}
          className={`px-4 py-2 rounded-full text-white font-semibold transition
            ${currentMode === mode ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'}`}
          onClick={() => setMode(mode)}
        >
          {mode.charAt(0).toUpperCase() + mode.slice(1)}
        </button>
      ))}
    </div>
  );
};

export default ModeSwitcher;
