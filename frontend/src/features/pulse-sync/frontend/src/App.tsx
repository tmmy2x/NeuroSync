import React, { useEffect, useRef, useState } from "react";
import { useTypingTracker } from "./useTypingTracker";
import MoodDashboard from "./MoodDashboard";
import { useFacialEmotion } from "./useFacialEmotion";
import MoodHistoryChart from "./MoodHistoryChart";
import axios from "axios";
import SelfCarePanel from "./SelfCarePanel";
import { requestNotificationPermission, showNotification } from "./notifications";
import { BrowserRouter as Router, Route, Routes, NavLink } from "react-router-dom";
import HistoryTab from "./pages/HistoryTab";
import InsightsTab from "./pages/InsightsTab";
import RitualsTab from "./pages/RitualsTab";
import CalendarTab from "./pages/CalendarTab";
import CoachTab from "./pages/CoachTab";

function App() {
  return (
    <Router>
      <div className="flex h-screen">
        <aside className="w-64 bg-gray-100 p-4">
          <nav className="space-y-2">
            {["History", "Insights", "Rituals", "Calendar", "Coach"].map((tab) => (
              <NavLink
                key={tab}
                to={`/${tab.toLowerCase()}`}
                className={({ isActive }) =>
                  `block px-3 py-2 rounded ${isActive ? "bg-indigo-600 text-white" : "hover:bg-gray-200"}`
                }
              >
                {tab}
              </NavLink>
            ))}
          </nav>
        </aside>
        <main className="flex-1 p-6 bg-gray-50 overflow-y-auto">
          <Routes>
            <Route path="/history" element={<HistoryTab />} />
            <Route path="/insights" element={<InsightsTab />} />
            <Route path="/rituals" element={<RitualsTab />} />
            <Route path="/calendar" element={<CalendarTab />} />
            <Route path="/coach" element={<CoachTab />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

// Removed duplicate default export

function TypingAndEmotionApp() {
    const { text, metrics, onChange } = useTypingTracker();
    const emotion = useFacialEmotion(); // 🎯 Facial Emotion
    const socketRef = useRef<WebSocket | null>(null);
    const [mood, setMood] = useState("Neutral");
    const [nudge, setNudge] = useState("");
    const [ritual, setRitual] = useState(null);
  
    useEffect(() => {
        requestNotificationPermission();
      }, []);
    
    useEffect(() => {
        socketRef.current = new WebSocket("ws://localhost:8000/ws");
        socketRef.current.onmessage = (msg) => {
          const data = JSON.parse(msg.data);
          setMood(data.mood);
          setNudge(data.nudge);
          setRitual(data.ritual);
          showNotification(data.nudge);
        };
      }, []);
    
    useEffect(() => {
      socketRef.current = new WebSocket("ws://localhost:8000/ws");
      socketRef.current.onmessage = (msg) => {
        const data = JSON.parse(msg.data);
        setMood(data.mood);
      };
    }, []);
  
    useEffect(() => {
      if (socketRef.current && text.length > 5) {
        socketRef.current.send(
          JSON.stringify({
            text,
            typing_metrics: metrics,
            face_emotion: emotion, // send facial signal
          })
        );
      }
    }, [text, emotion]);

    useEffect(() => {
        socketRef.current = new WebSocket("ws://localhost:8000/ws");
        socketRef.current.onmessage = (msg) => {
          const data = JSON.parse(msg.data);
          setMood(data.mood);
          setNudge(data.nudge);
        };
      }, []);

    return (
        <div>
          <video id="video" width="300" height="200" autoPlay muted></video>
          <MoodDashboard mood={mood} />
        </div>
      );
    }

    function MoodHistoryApp() {
            const [moodHistory, setMoodHistory] = useState<any[]>([]);
          
            useEffect(() => {
              const interval = setInterval(() => {
                axios.get("http://localhost:8000/mood-history").then((res) => {
                  setMoodHistory(res.data);
                });
              }, 5000); // update every 5s
              return () => clearInterval(interval);
            }, []);
          
            return (
              <>
                {/* ...previous content */}
                <MoodHistoryChart data={moodHistory} />
              </>
            );
          }    

export default App;
