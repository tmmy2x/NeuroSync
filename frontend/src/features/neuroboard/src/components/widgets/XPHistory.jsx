import { useEffect, useState } from 'react'
import { format } from 'date-fns'

export default function XPHistory({ username }) {
  const [events, setEvents] = useState([])

  useEffect(() => {
    fetch(`http://localhost:8000/api/xp-history/${username}`)
      .then(res => res.json())
      .then(data => setEvents(data.history || []))
  }, [username])

  return (
    <div className="bg-white p-4 rounded-2xl shadow mt-6 max-w-md mx-auto">
      <h2 className="text-lg font-bold mb-3">🕒 XP Timeline</h2>
      {events.length > 0 ? (
        <ul className="border-l-2 border-blue-500 pl-4 space-y-4 text-sm">
          {events.map((e, i) => (
            <li key={i} className="relative">
              <div className="absolute -left-[9px] top-1 w-3 h-3 bg-blue-500 rounded-full" />
              <p className="font-medium">
                {e.type === 'praise_received' ? '🏅 Received praise' : '💌 Sent praise'}: {e.message}
              </p>
              <p className="text-xs text-gray-500">
                +{e.xp} XP — {format(new Date(e.timestamp), 'PPpp')}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">No XP history available.</p>
      )}
    </div>
  )
}
