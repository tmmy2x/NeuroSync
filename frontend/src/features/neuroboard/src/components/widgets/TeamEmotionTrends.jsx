import { useEffect, useState } from 'react'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js'
import { parseISO, format } from 'date-fns'

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend)

const EMOTION_LABELS = ['joy', 'sadness', 'anger', 'fear', 'surprise', 'calm']

export default function TeamEmotionTrends() {
  const [chartData, setChartData] = useState(null)

  useEffect(() => {
    fetch('http://localhost:8000/api/team-emotions/history')
      .then(res => res.json())
      .then(data => {
        const dailyTotals = {}

        for (const [_, entries] of Object.entries(data)) {
          entries.forEach(entry => {
            const day = format(parseISO(entry.timestamp), 'yyyy-MM-dd')
            if (!dailyTotals[day]) {
              dailyTotals[day] = { count: 0, totals: {} }
              EMOTION_LABELS.forEach(e => dailyTotals[day].totals[e] = 0)
            }

            EMOTION_LABELS.forEach(e => {
              dailyTotals[day].totals[e] += entry.emotions[e] || 0
            })
            dailyTotals[day].count += 1
          })
        }

        const sortedDays = Object.keys(dailyTotals).sort()
        const dataset = EMOTION_LABELS.map((emotion, idx) => {
          return {
            label: emotion,
            data: sortedDays.map(day =>
              Math.round(dailyTotals[day].totals[emotion] / dailyTotals[day].count)
            ),
            fill: false,
            tension: 0.3,
            borderColor: `hsl(${idx * 60}, 70%, 50%)`,
            backgroundColor: `hsl(${idx * 60}, 70%, 50%)`,
          }
        })

        setChartData({
          labels: sortedDays,
          datasets: dataset,
        })
      })
  }, [])

  return (
    <div className="bg-white p-4 rounded-2xl shadow mt-6">
      <h2 className="text-lg font-bold mb-2">Team Emotion Trends (Last 30 Days)</h2>
      {chartData ? (
        <Line
          data={chartData}
          options={{
            responsive: true,
            plugins: {
              legend: { position: 'top' },
              tooltip: { mode: 'index', intersect: false },
            },
            scales: {
              y: {
                suggestedMin: 0,
                suggestedMax: 100,
              },
            },
          }}
        />
      ) : (
        <p className="text-gray-500">Loading trend data...</p>
      )}
    </div>
  )
}
