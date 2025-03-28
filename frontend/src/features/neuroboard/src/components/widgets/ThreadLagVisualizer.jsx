import { useEffect, useState } from 'react'

export default function ThreadLagVisualizer() {
  const [threads, setThreads] = useState([])

  useEffect(() => {
    fetch('http://localhost:8000/api/communication/thread-lags')
      .then(res => res.json())
      .then(data => setThreads(data.threads || []))
  }, [])

  return (
    <div className="bg-white p-4 rounded-2xl shadow mt-6 max-w-2xl">
      <h2 className="text-lg font-bold mb-2">⏱️ Reply Lag by Thread</h2>
      <ul className="text-sm space-y-2">
        {threads.map((t, i) => (
          <li key={i} className="border-b pb-2">
            <strong>{t.thread}</strong> — {t.lag_minutes} min
            <div className="text-xs text-gray-500">{new Date(t.reply_at).toLocaleString()}</div>
          </li>
        ))}
      </ul>
    </div>
  )
}
