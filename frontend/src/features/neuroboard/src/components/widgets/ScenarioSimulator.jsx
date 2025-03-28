import { useState } from 'react'
import { Line } from 'react-chartjs-2'

export default function ScenarioSimulator() {
  const [sim, setSim] = useState(null)
  const [params, setParams] = useState({ meeting: 0.5, praise: 0.2, quiet: 0.1 })

  const simulate = async () => {
    const res = await fetch('http://localhost:8000/api/simulation/burnout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        days: 14,
        meeting_reduction: params.meeting,
        praise_boost: params.praise,
        quiet_hours: params.quiet
      })
    })
    const data = await res.json()
    setSim(data.simulation || [])
  }

  return (
    <div className="bg-white p-4 rounded-2xl shadow mt-6 max-w-2xl">
      <h2 className="text-lg font-bold mb-3">🎮 Burnout Scenario Simulator</h2>
      <div className="flex gap-4 mb-3">
        <label className="text-sm">
          🗓️ Meeting Cut (%):
          <input type="number" step="0.1" min="0" max="1" value={params.meeting}
            onChange={e => setParams({ ...params, meeting: parseFloat(e.target.value) })}
            className="border p-1 rounded w-20 ml-2" />
        </label>
        <label className="text-sm">
          🌟 Praise Boost (%):
          <input type="number" step="0.1" min="0" max="1" value={params.praise}
            onChange={e => setParams({ ...params, praise: parseFloat(e.target.value) })}
            className="border p-1 rounded w-20 ml-2" />
        </label>
        <label className="text-sm">
          💤 Quiet Hours (%):
          <input type="number" step="0.1" min="0" max="1" value={params.quiet}
            onChange={e => setParams({ ...params, quiet: parseFloat(e.target.value) })}
            className="border p-1 rounded w-20 ml-2" />
        </label>
      </div>
      <button onClick={simulate} className="bg-indigo-600 text-white px-4 py-2 rounded text-sm">
        Simulate
      </button>

      {sim && (
        <Line
          data={{
            labels: sim.map(d => d.date),
            datasets: [{
              label: 'Simulated Burnout Score',
              data: sim.map(d => d.simulated_score),
              borderColor: '#7c3aed',
              backgroundColor: 'rgba(124,58,237,0.1)',
              tension: 0.3
            }]
          }}
          options={{ plugins: { legend: { display: false } }, scales: { y: { min: -2, max: 5 } } }}
          className="mt-4"
        />
      )}
    </div>
  )
}
