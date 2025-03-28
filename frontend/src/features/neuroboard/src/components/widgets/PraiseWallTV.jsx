import { useEffect, useState } from 'react'

export default function PraiseWallTV() {
  const [index, setIndex] = useState(0)
  const [praises, setPraises] = useState([])

  useEffect(() => {
    fetch('http://localhost:8000/api/praise/logs')
      .then(res => res.json())
      .then(data => setPraises(data.logs || []))
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % (praises.length || 1))
    }, 4000)
    return () => clearInterval(interval)
  }, [praises])

  if (!praises.length) return <p>Loading praise wall...</p>
  const p = praises[index]

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-green-100 text-green-900 transition-all duration-500">
      <h1 className="text-3xl font-bold mb-8">💚 Praise Spotlight</h1>
      <div className="bg-white p-6 rounded-xl shadow-lg max-w-xl text-center">
        <p className="text-xl font-semibold">“{p.message}”</p>
        <p className="mt-4 text-sm text-gray-600">
          From <strong>{p.sender || 'Anonymous'}</strong> → <strong>{p.user}</strong>
        </p>
      </div>
    </div>
  )
}
