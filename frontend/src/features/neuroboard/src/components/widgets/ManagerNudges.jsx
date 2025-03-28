import { useEffect, useState } from 'react'
import { parseISO, format } from 'date-fns'
import { toast } from 'react-toastify'

const handleAction = async (user, action) => {
    toast.success(`${action} sent to ${user}!`, { position: "bottom-right" })
}

const [emojiOptions, setEmojiOptions] = useState([])
const [selectedEmoji, setSelectedEmoji] = useState('')

const messageWithEmoji = `${message} ${selectedEmoji || ''}`

await fetch('http://localhost:8000/api/praise', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ user, sender: username, message: messageWithEmoji, via }),
})


export default function ManagerNudges() {
    const [nudges, setNudges] = useState([])
  
    const handleAction = async (user, action) => {
        let message =
          action === 'Send Praise'
            ? `Appreciate your effort, ${user}! Your positivity is noticed.`
            : `Take a breather, ${user}. Consider a short break to recharge.`
      
        const via = 'slack'
      
        await fetch('http://localhost:8000/api/praise', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user, sender: username, message, via }),
          })
      
        alert(`${action} sent to ${user} via ${via}!`)
      }
      
      
  
    useEffect(() => {
      const fetchNudges = async () => {
        const res = await fetch('http://localhost:8000/api/team-emotions/history')
        const history = await res.json()
  
        const aiRes = await fetch('http://localhost:8000/api/nudges/gpt', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ emotion_history: history }),
        })
  
        const { nudges } = await aiRes.json()
        setNudges(nudges)
      }
  
      fetchNudges()
    }, [])
  
    useEffect(() => {
        fetch(`http://localhost:8000/api/praise/emojis/${username}`)
          .then(res => res.json())
          .then(data => setEmojiOptions(data.emojis || []))
      }, [])


    return (
      <div className="bg-white p-4 rounded-2xl shadow">
        <h2 className="text-lg font-bold mb-2">Manager Nudges</h2>
        {nudges.length > 0 ? (
          <ul className="space-y-4">
            {nudges.map((n, i) => (
              <li key={i} className="text-sm bg-gray-50 p-3 rounded-md border">
                <p><strong>{n.type}:</strong> {n.message}</p>
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => handleAction(n.user, 'Send Praise')}
                    className="px-3 py-1 bg-green-500 text-white text-xs rounded"
                  >
                    Send Praise
                  </button>
                  <button
                    onClick={() => handleAction(n.user, 'Schedule Break')}
                    className="px-3 py-1 bg-blue-500 text-white text-xs rounded"
                  >
                    Schedule Break
                  </button>
                  <div className="mt-2 flex gap-2 flex-wrap">
  {emojiOptions.map((e) => (
    <button
      key={e}
      onClick={() => setSelectedEmoji(e)}
      className={`px-2 py-1 text-xl rounded border ${
        selectedEmoji === e ? 'bg-blue-100 border-blue-500' : 'bg-white'
      }`}
    >
      {e}
    </button>
  ))}
</div>

                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No AI-generated nudges right now.</p>
        )}
      </div>
    )
  }
  