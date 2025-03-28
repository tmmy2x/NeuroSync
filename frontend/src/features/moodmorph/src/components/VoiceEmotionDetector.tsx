import React, { useEffect, useState } from 'react';
import { analyzeTextMood } from '../hooks/useTextSentiment';

type Mode = 'focus' | 'calm' | 'power' | 'restore';

type SpeechRecognitionResultList = {
    length: number;
    item: (index: number) => SpeechRecognitionResult;
    [index: number]: SpeechRecognitionResult;
  };
  

interface Props {
  onDetect: (mode: Mode) => void;
}

const VoiceEmotionDetector: React.FC<Props> = ({ onDetect }) => {
  const [listening, setListening] = useState(false);
  const SpeechRecognition =
    (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

  useEffect(() => {
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event: any) => {
      const transcript = Array.from(event.results as SpeechRecognitionResultList)
        .map((result) => result[0].transcript)
        .join(' ');

      const detected = analyzeTextMood(transcript);
      onDetect(detected);
    };

    recognition.onend = () => {
      if (listening) recognition.start(); // Keep it listening
    };

    if (listening) recognition.start();
    else recognition.stop();

    return () => recognition.stop();
  }, [listening, onDetect]);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        className={`px-4 py-2 rounded-full font-bold shadow-lg ${
          listening ? 'bg-red-600 text-white' : 'bg-green-500 text-black'
        }`}
        onClick={() => setListening(!listening)}
      >
        {listening ? 'Stop Voice' : 'Start Voice'}
      </button>
    </div>
  );
};

export default VoiceEmotionDetector;
