import { useEffect, useState } from 'react'

export default function StructuralSuggestions() {
  const [suggestions, setSuggestions] = useState('')

  useEffect(() => {
    fetch('http://localhost:8000/api/insights/structural-suggestions')
      .then(res => res.json())
      .then(data => setSuggestions(data.suggestions || 'No suggestions yet.'))
  }, [])

  return (
    <div className="bg-white p-4 rounded-2xl shadow mt-6 max-w-2xl">
      <h2 className="text-lg font-bold mb-3">🧭 AI-Powered Structural Suggestions</h2>
      <pre className="whitespace-pre-wrap text-sm text-gray-800">{suggestions}</pre>
    </div>
  )
}
