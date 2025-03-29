import React from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, PointElement } from "chart.js";
ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement);

type MoodEntry = { mood: string; timestamp: string };

const moodToScore = (mood: string): number => {
  const map: Record<string, number> = {
    Joyful: 5,
    Energized: 4,
    Neutral: 3,
    Stressed: 2,
    Low: 1,
    Anxious: 1,
    Frustrated: 1,
  };
  return map[mood] ?? 3;
};

const MoodHistoryChart = ({ data }: { data: MoodEntry[] }) => {
  const labels = data.map(entry => new Date(entry.timestamp).toLocaleTimeString());
  const scores = data.map(entry => moodToScore(entry.mood));

  return (
    <div className="mt-6 p-4 bg-white rounded shadow">
      <p className="font-bold text-lg mb-2">Mood History</p>
      <Line
        data={{
          labels,
          datasets: [
            {
              label: "Mood Level",
              data: scores,
              fill: false,
              tension: 0.2,
              borderWidth: 2,
            },
          ],
        }}
        options={{
          scales: {
            y: {
              min: 0,
              max: 5,
              ticks: {
                callback: (tickValue: string | number) => {
                  if (typeof tickValue === "number") {
                    const reverseMap = ["", "Low", "Stressed", "Neutral", "Energized", "Joyful"];
                    return reverseMap[tickValue];
                  }
                  return tickValue; // Fallback for string type
                },
              },
            },
          },
        }}
      />
    </div>
  );
};

export default MoodHistoryChart;
