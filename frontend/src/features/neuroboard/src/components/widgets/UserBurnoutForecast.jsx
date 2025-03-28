import { useEffect, useState } from 'react'

export default function UserBurnoutForecast() {
  const [users, setUsers] = useState([])

  useEffect(() => {
    fetch('http://localhost:8000/api/prediction/user-burnout')
      .then(res => res.json())
      .then(data => setUsers(data.users || []))
  }, [])

  return (
    <div className="bg-white p-4 rounded-2xl shadow mt-6 max-w-2xl">
      <h2 className="text-lg font-bold mb-3">🔮 User Burnout Forecast</h2>
      <ul className="text-sm space-y-2">
        {users.map((u, i) => (
          <li key={i} className="flex justify-between border-b pb-1">
            <span>
              <strong>{u.user}</strong> → Today: {u.last_score}
            </span>
            <span className="text-red-600 font-semibold">
              Forecast: {u.forecast}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
