import { useState } from 'react';
import ModeSwitcher from './components/ModeSwitcher';
import Focus from './components/modes/Focus';
import Calm from './components/modes/Calm';
import Power from './components/modes/Power';
import Restore from './components/modes/Restore';
import ModeWrapper from './components/ModeWrapper';
import { analyzeTextMood } from './hooks/useTextSentiment';
import FaceEmotionDetector from './components/FaceEmotionDetector';
import VoiceEmotionDetector from './components/VoiceEmotionDetector';
import DetectionToggles from './components/DetectionToggles';
import FlowForgeSidebar from './components/FlowForgeSidebar';


type Mode = 'focus' | 'calm' | 'power' | 'restore';

function App() {
  const [mode, setMode] = useState<Mode>('focus');
  const [input, setInput] = useState('');
  const [source, setSource] = useState<string>('manual');
  const [toggles, setToggles] = useState({
    text: true,
    face: true,
    voice: true,
  });
  const [sidebarOpen, setSidebarOpen] = useState(true);

  


  const handleAnalyze = () => {
    const detected = analyzeTextMood(input);
    setMode(detected);
  };

  const renderMode = () => {
    switch (mode) {
      case 'focus': return <Focus />;
      case 'calm': return <Calm />;
      case 'power': return <Power />;
      case 'restore': return <Restore />;
    }
  };

  return (
    <ModeWrapper mode={mode}>
      <ModeSwitcher currentMode={mode} setMode={setMode} />

      <DetectionToggles toggles={toggles} setToggles={setToggles} />


      <div className="flex justify-center p-4">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="How are you feeling right now?"
          className="w-full max-w-md px-4 py-2 text-black rounded-l-lg"
        />
        <button
          onClick={handleAnalyze}
          className="px-4 py-2 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 transition"
        >
          Analyze
        </button>
      </div>
      <div className="text-center text-sm text-gray-300 mt-2">
  Emotion mode set by: <span className="font-bold capitalize">{source}</span>
</div>


      {renderMode()}
      {toggles.face && (
  <FaceEmotionDetector onDetect={(mode) => {
    setMode(mode);
    setSource('facial');
  }} />
)}

{toggles.voice && (
  <VoiceEmotionDetector onDetect={(mode) => {
    setMode(mode);
    setSource('voice');
  }} />
)}

<div className="text-center text-sm text-gray-300 mt-2">
    Emotion mode set by: <span className="font-bold capitalize">{source}</span>
  </div>

   {/* ✅ Add sidebar here (inside wrapper, last in DOM) */}
   <FlowForgeSidebar />
   <button
  onClick={() => setSidebarOpen(!sidebarOpen)}
  className="fixed top-4 right-4 z-50 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-full shadow-lg"
>
  {sidebarOpen ? 'Close FlowForge' : 'Open FlowForge'}
</button>

  {/* ✅ Sidebar: Conditionally Rendered */}
  {sidebarOpen && <FlowForgeSidebar />}
    </ModeWrapper>
  );
}

export default App;
