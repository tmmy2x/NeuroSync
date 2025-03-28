import { useEffect, useState } from 'react'

export default function EmotionalDiversityIndex() {
  const [days, setDays] = useState([])

  useEffect(() => {
    fetch('http://localhost:8000/api/insights/emotion-diversity')
      .then(res => res.json())
      .then(data => setDays(data.diversity || []))
  }, [])

  return (
    <div className="bg-white p-4 rounded-2xl shadow mt-6 max-w-xl">
      <h2 className="text-lg font-bold mb-3">📊 Emotional Diversity Index</h2>
      {days.length > 0 ? (
        <ul className="text-sm space-y-3">
          {days.map((d, i) => (
            <li key={i} className="border-b pb-2">
              <div className="flex justify-between">
                <span>{new Date(d.date).toDateString()}</span>
                <span className="font-bold text-green-700">{d.score}/100</span>
              </div>
              <p className="text-xs text-gray-500">
                {d.unique_emotions} emotion types from {d.sample_count} entries
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">No emotional history yet.</p>
      )}
    </div>
  )
}
