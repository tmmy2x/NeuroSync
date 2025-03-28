import { useEffect, useState } from 'react'
import { Line } from 'react-chartjs-2'
import 'chart.js/auto'

export default function BurnoutPredictionChart() {
  const [data, setData] = useState(null)

  useEffect(() => {
    fetch('http://localhost:8000/api/prediction/burnout?days=14')
      .then(res => res.json())
      .then(setData)
  }, [])

  if (!data) return null

  const labels = [...data.history, ...data.forecast].map(d => d.date)
  const scores = [...data.history.map(h => h.score), ...data.forecast.map(f => f.predicted_score)]

  return (
    <div className="bg-white p-4 rounded-2xl shadow mt-6 max-w-2xl">
      <h2 className="text-lg font-bold mb-3">📈 Burnout Risk Trajectory (Next 2 Weeks)</h2>
      <Line
        data={{
          labels,
          datasets: [
            {
              label: 'Burnout Score',
              data: scores,
              borderColor: '#e11d48',
              backgroundColor: 'rgba(225,29,72,0.1)',
              tension: 0.4,
              pointRadius: 3
            }
          ]
        }}
        options={{
          scales: {
            y: {
              min: -2,
              max: 5,
              title: { display: true, text: 'Stress Index' }
            }
          },
          plugins: {
            legend: { display: false }
          }
        }}
      />
    </div>
  )
}
{data.trigger_alert && (
    <div className="bg-red-100 border border-red-400 text-red-700 p-2 rounded mb-4 text-sm">
      🚨 Forecast suggests a potential burnout spike in the next 2 weeks.
      Consider scheduling a reset ritual or reducing load.
    </div>
  )}
  