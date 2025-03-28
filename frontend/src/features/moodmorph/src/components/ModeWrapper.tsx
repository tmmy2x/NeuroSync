import { useEffect } from 'react';

interface Props {
  mode: 'focus' | 'calm' | 'power' | 'restore';
  children: React.ReactNode;
}

const bgImages: Record<string, string> = {
  focus: '/backgrounds/focus.jpg',
  calm: '/backgrounds/calm.jpg',
  power: '/backgrounds/power.jpg',
  restore: '/backgrounds/restore.jpg',
};

const soundFiles: Record<string, string> = {
  focus: '/sounds/focus.mp3',
  calm: '/sounds/calm.mp3',
  power: '/sounds/power.mp3',
  restore: '/sounds/restore.mp3',
};

const ModeWrapper: React.FC<Props> = ({ mode, children }) => {
  useEffect(() => {
    const audio = new Audio(soundFiles[mode]);
    audio.loop = true;
    audio.volume = 0.3;
    audio.play().catch(() => null); // Prevent autoplay error

    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }, [mode]);

  return (
    <div
      className="min-h-screen bg-cover bg-center transition-all duration-700"
      style={{ backgroundImage: `url(${bgImages[mode]})` }}
    >
      <div className="backdrop-blur-sm min-h-screen bg-black/60 flex flex-col">
        {children}
      </div>
    </div>
  );
};

export default ModeWrapper;
