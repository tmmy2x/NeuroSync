import { useEffect, useState } from 'react'
import { format } from 'date-fns'

export default function PraiseWall() {
  const [praises, setPraises] = useState([])
  const [filtered, setFiltered] = useState([])
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetch('http://localhost:8000/api/praise/logs')
      .then(res => res.json())
      .then(data => {
        const sorted = (data.logs || []).sort((a, b) =>
          new Date(b.timestamp) - new Date(a.timestamp)
        )
        setPraises(sorted)
        setFiltered(sorted)
      })
  }, [])

  useEffect(() => {
    if (!search) return setFiltered(praises)
    setFiltered(
      praises.filter(
        (p) =>
          p.user.toLowerCase().includes(search.toLowerCase()) ||
          (p.sender && p.sender.toLowerCase().includes(search.toLowerCase()))
      )
    )
  }, [search, praises])

  return (
    <div className="bg-white p-4 rounded-2xl shadow">
      <h2 className="text-lg font-bold mb-3">🌟 Praise Wall</h2>

      <input
        type="text"
        placeholder="Search by name or sender..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-4 w-full p-2 border rounded text-sm"
      />

      {filtered.length > 0 ? (
        <ul className="grid md:grid-cols-2 gap-4 text-sm">
          {filtered.map((praise, i) => (
            <li key={i} className="bg-green-50 p-3 rounded-lg border border-green-200 shadow-sm">
              <p className="font-medium text-green-900">{praise.message}</p>
              <div className="text-xs text-gray-600 mt-1">
                From <strong>{praise.sender || 'Anonymous'}</strong> → <strong>{praise.user}</strong>
              </div>
              <div className="text-xs text-gray-400">
                {format(new Date(praise.timestamp), 'MMM d, yyyy • h:mm a')}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">No praise yet — spread some positivity!</p>
      )}
    </div>
  )
}

