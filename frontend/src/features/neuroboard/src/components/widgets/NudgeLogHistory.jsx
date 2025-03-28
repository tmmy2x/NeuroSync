import { useEffect, useState } from 'react'

export default function NudgeLogHistory() {
  const [logs, setLogs] = useState([])

  useEffect(() => {
    fetch('http://localhost:8000/api/praise/logs')
      .then(res => res.json())
      .then(data => setLogs(data.logs || []))
  }, [])

  return (
    <div className="bg-white p-4 rounded-2xl shadow mt-6">
      <h2 className="text-lg font-bold mb-2">Praise & Nudge Log</h2>
      {logs.length > 0 ? (
        <ul className="text-sm space-y-2">
          {logs.map((log, i) => (
            <li key={i} className="border p-2 rounded-md bg-gray-50">
              <strong>{log.user}</strong> — {log.message}
              <div className="text-xs text-gray-500 mt-1">
                via {log.via} @ {new Date(log.timestamp).toLocaleString()}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">No praise or nudges recorded yet.</p>
      )}
    </div>
  )
}
