import React from "react";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import { useState } from "react";
import axios from "axios";

const MoodCalendarHeatmap = ({ data }) => {
    return (
      <div>
        <h2 className="text-xl font-bold mb-4">📅 Mood Calendar</h2>
        <CalendarHeatmap
          startDate={new Date(new Date().setMonth(new Date().getMonth() - 1))}
          endDate={new Date()}
          values={data.map(d => ({
            date: d.date,
            count: d.score,
            breaks: d.breaks || 0
          }))}
          classForValue={(value) => {
            if (!value) return "color-empty";
            if (value.count >= 4) return "color-github-4";
            if (value.count >= 3) return "color-github-3";
            if (value.count >= 2) return "color-github-2";
            return "color-github-1";
          }}
          tooltipDataAttrs={(value) => ({
            'data-tip': `${value?.date || ''} – Mood: ${value?.count || 0}/5 · Breaks: ${value?.breaks || 0}`
          }) as any}
          showWeekdayLabels
          // Custom rendering of blocks is not supported directly; use CSS for styling.
        />
      </div>
    );
  };
 
  const MoodCalendar = ({ data }) => {
    interface LogEntry {
        mood: string;
        timestamp: string;
        context?: string;
    }

    const [log, setLog] = useState<LogEntry[]>([]);
    const [selectedDay, setSelectedDay] = useState(null);
  
    const fetchDayLog = async (date) => {
      setSelectedDay(date);
      const res = await axios.get(`http://localhost:8000/day-log/${date}`);
      setLog(res.data);
    };
  
    return (
      <div>
        <h2 className="text-xl font-bold mb-4">📅 Mood Calendar</h2>
        <CalendarHeatmap
          startDate={new Date(new Date().setMonth(new Date().getMonth() - 1))}
          endDate={new Date()}
          values={data.map(d => ({
            date: d.date,
            count: d.score,
            breaks: d.breaks || 0
          }))}
          classForValue={(value) => {
            if (!value) return "color-empty";
            if (value.count >= 4) return "color-github-4";
            if (value.count >= 3) return "color-github-3";
            if (value.count >= 2) return "color-github-2";
            return "color-github-1";
          }}
          tooltipDataAttrs={(value) => ({
            'data-tip': `${value?.date || ''} – Mood: ${value?.count || 0}/5 · Breaks: ${value?.breaks || 0}`
          }) as any}
          showWeekdayLabels
          onClick={(value) => value?.date && fetchDayLog(value.date)}
        />
  
        {selectedDay && (
          <div className="mt-6 p-4 bg-white rounded shadow">
            <h3 className="font-semibold mb-2">🗓️ {selectedDay} — Entries</h3>
            {log.map((entry, i) => (
              <div key={i} className="text-sm border-b py-1">
                🧠 Mood: <strong>{entry.mood}</strong><br />
                ⏱️ Time: {new Date(entry.timestamp).toLocaleTimeString()}<br />
                {entry.context === "scheduled_break" && (
                  <span className="text-purple-600">🧘 Break Triggered</span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };
  
  export default MoodCalendar;
