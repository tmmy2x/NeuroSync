import { useEffect, useState } from 'react'

export default function TopStressDays() {
  const [days, setDays] = useState([])
  const [notes, setNotes] = useState({})

  useEffect(() => {
    fetch('http://localhost:8000/api/insights/stress-days')
      .then(res => res.json())
      .then(data => setDays(data.top_stress_days || []))

    fetch('http://localhost:8000/api/insights/day-notes')
      .then(res => res.json())
      .then(setNotes)
  }, [])

  const addNote = async (date) => {
    const note = prompt(`Add context for ${date}`)
    if (!note) return
    const res = await fetch('http://localhost:8000/api/insights/day-notes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date, note })
    })
    const data = await res.json()
    setNotes(data.notes || {})
  }

  return (
    <div className="bg-white p-4 rounded-2xl shadow mt-6 max-w-xl">
      <h2 className="text-lg font-bold mb-3">📅 Top Stress Days</h2>
      {days.length ? (
        <ul className="text-sm space-y-4">
          {days.map((d, i) => (
            <li key={i} className="border-b pb-2">
              <div className="flex justify-between items-center">
                <span className="font-medium">{new Date(d.date).toDateString()}</span>
                <span className="text-red-600 font-bold">{d.score}</span>
              </div>
              <p className="text-xs text-gray-500">{d.count} mood entries</p>
              <p className="text-xs text-blue-700 mt-1 italic">
                {notes[d.date] || 'No context added'}
              </p>
              <button
                onClick={() => addNote(d.date)}
                className="mt-1 text-xs text-blue-600 hover:underline"
              >
                ✏️ Add Note
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">No stress data yet.</p>
      )}
    </div>
  )
}

