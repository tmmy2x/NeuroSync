import { useEffect, useState } from 'react'

export default function ResponseLagAnalyzer() {
  const [lagData, setLagData] = useState({})

  useEffect(() => {
    const fetchLag = () => {
      fetch('http://localhost:8000/api/communication/response-lag')
        .then(res => res.json())
        .then(data => setLagData(data.lag || {}))
    }

    fetchLag()
    const interval = setInterval(fetchLag, 60000) // auto-refresh every 60s
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="bg-white p-4 rounded-2xl shadow mt-6">
      <h2 className="text-lg font-bold mb-3">🕒 Response Lag (Minutes)</h2>

      {Object.keys(lagData).length > 0 ? (
        <ul className="text-sm space-y-2">
          {Object.entries(lagData).map(([channel, minutes]) => (
            <li key={channel} className="flex justify-between border-b pb-1">
              <span>{channel}</span>
              <span className="font-semibold">{minutes} min</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">No response data available.</p>
      )}
    </div>
  )
}
