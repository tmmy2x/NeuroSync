import { useEffect, useState } from "react";
import axios from "axios";

const MoodSummary = () => {
  const [summary, setSummary] = useState({ most_common_mood: "", best_hour: 0 });

  useEffect(() => {
    axios.get("http://localhost:8000/mood-summary").then((res) => {
      setSummary(res.data);
    });
  }, []);

  if (!summary.most_common_mood) return null;

  return (
    <div className="mt-6 p-4 bg-white rounded shadow">
      <p className="text-lg font-semibold mb-1">📊 Mood Insights</p>
      <p>Most Frequent Mood: <strong>{summary.most_common_mood}</strong></p>
      <p>Best Hour of Day: <strong>{summary.best_hour}:00</strong></p>
    </div>
  );
};

export default MoodSummary;
