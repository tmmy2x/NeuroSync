import { useEffect, useState } from 'react'

export default function Leaderboard() {
  const [leaders, setLeaders] = useState([])

  useEffect(() => {
    fetch('http://localhost:8000/api/gamification/leaderboard')
      .then(res => res.json())
      .then(setLeaders)
  }, [])

  return (
    <div className="bg-white p-4 rounded-2xl shadow">
      <h2 className="text-lg font-bold mb-3">🏆 Leaderboard</h2>
      {leaders.length > 0 ? (
        <ol className="list-decimal ml-6 space-y-1 text-sm">
          {leaders.map((entry, i) => (
            <li key={i}>
              <strong>{entry.user}</strong> — {entry.xp} XP
              {entry.badge && (
                <span className="text-yellow-600 font-semibold ml-2">
                  🏅 {entry.badge}
                </span>
              )}
            </li>
          ))}
        </ol>
      ) : (
        <p className="text-gray-500">Leaderboard not available yet.</p>
      )}
    </div>
  )
}
