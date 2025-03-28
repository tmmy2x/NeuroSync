import { useEffect, useState } from 'react'

export default function BurnoutRiskGauge() {
  const [score, setScore] = useState(0)

  useEffect(() => {
    fetch('http://localhost:8000/api/team-emotions/history')
      .then(res => res.json())
      .then(data => {
        let total = 0
        let risks = 0

        for (const entries of Object.values(data)) {
          const recent = entries.slice(-5)
          for (const e of recent) {
            const joy = e.emotions.joy || 0
            const calm = e.emotions.calm || 0
            const sadness = e.emotions.sadness || 0
            const anger = e.emotions.anger || 0

            const posAvg = (joy + calm) / 2
            const negAvg = (sadness + anger) / 2

            total++
            if (negAvg > posAvg) risks++
          }
        }

        const burnoutPercent = total > 0 ? Math.round((risks / total) * 100) : 0
        setScore(burnoutPercent)
      })
  }, [])

  return (
    <div className="bg-white p-4 rounded-2xl shadow mt-6 max-w-md mx-auto">
      <h2 className="text-lg font-bold mb-2">Team Burnout Risk</h2>
      <div className="w-full bg-gray-200 h-6 rounded-full overflow-hidden">
        <div
          className={`h-full text-xs font-medium text-center text-white ${
            score < 30 ? 'bg-green-500' : score < 70 ? 'bg-yellow-500' : 'bg-red-600'
          }`}
          style={{ width: `${score}%` }}
        >
          {score}%
        </div>
      </div>
      <p className="text-sm text-gray-500 mt-1">
        Based on recent team emotional trends (last 5 data points per user).
      </p>
    </div>
  )
}
