import { useEffect, useState } from 'react'

<XPHistory username={username} />

export default function NotificationInbox({ username }) {
  const [inbox, setInbox] = useState([])
  const [xp, setXp] = useState(0)
  const [badge, setBadge] = useState('')

  useEffect(() => {
    fetch(`http://localhost:8000/api/praise/inbox/${username}`)
      .then(res => res.json())
      .then(data => setInbox(data.inbox || []))

    fetch('http://localhost:8000/api/gamification/xp')
      .then(res => res.json())
      .then(data => {
        setXp(data.xp?.[username] || 0)
        setBadge(data.badges?.[username] || '')
      })
  }, [username])

  return (
    <div className="bg-white p-4 rounded-2xl shadow mt-6 max-w-md mx-auto">
      <h2 className="text-lg font-bold mb-2">🎁 Your Recognition Inbox</h2>

      <div className="mb-4 flex justify-between items-center bg-gray-50 p-3 rounded-md border">
        <div>
          <p className="text-sm font-semibold">{username}</p>
          <p className="text-xs text-gray-500">XP: {xp}</p>
        </div>
        {badge && (
          <div className="text-green-700 text-sm font-bold bg-green-100 px-3 py-1 rounded-full">
            🏅 {badge}
          </div>
        )}
      </div>

      {inbox.length > 0 ? (
        <ul className="space-y-3 text-sm">
          {inbox.map((log, i) => (
            <li key={i} className="bg-gray-100 p-3 rounded-md">
              {log.message}
              <div className="text-xs text-gray-500">
                {new Date(log.timestamp).toLocaleString()}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">No praise yet — you're due some love!</p>
      )}
    </div>
  )
}

