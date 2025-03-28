import { useEffect, useState, useRef } from 'react'
import Confetti from 'react-confetti'

export default function GamificationPanel() {
  const [xp, setXp] = useState({})
  const [badges, setBadges] = useState({})
  const [showConfetti, setShowConfetti] = useState(false)
  const lastBadges = useRef({})

  useEffect(() => {
    fetch('http://localhost:8000/api/gamification/xp')
      .then(res => res.json())
      .then(data => {
        setXp(data.xp || {})

        // Badge unlock detection
        const newBadges = data.badges || {}
        for (const user in newBadges) {
          if (lastBadges.current[user] !== newBadges[user]) {
            setShowConfetti(true)
            setTimeout(() => setShowConfetti(false), 5000)
            break
          }
        }
        lastBadges.current = newBadges
        setBadges(newBadges)
      })
  }, [])

  return (
    <div className="bg-white p-4 rounded-2xl shadow relative">
      {showConfetti && <Confetti numberOfPieces={250} recycle={false} />}
      <h2 className="text-lg font-bold mb-3">🎮 Gamification Dashboard</h2>
      <ul className="space-y-2 text-sm">
        {Object.entries(xp).map(([user, points]) => (
          <li key={user} className="flex justify-between border-b pb-1">
            <span>
              <strong>{user}</strong> — {points} XP
            </span>
            <span className="text-green-600 font-medium">
              {badges[user] ? `🏅 ${badges[user]}` : ''}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

