import { useState } from 'react'
import axios from 'axios'
import { useEffect as reactUseEffect } from 'react'

export default function Thoughts() {
  const userId: string = "exampleUserId"; // Replace with actual logic to fetch userId
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [continued, setContinued] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [thoughts, setThoughts] = useState<string[]>([])
  const [selected, setSelected] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<string[]>([])
  

  customUseEffect(() => {
    const fetchThoughts = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/thought/${userId}`)
        setThoughts(res.data.thoughts || [])
      } catch {
        console.log("No thoughts found.")
      }
    }

    if (userId) fetchThoughts()
  }, [userId])

  const handleSave = async () => {
    if (!title || !content || !userId) {
      setError("Please enter all fields.")
      return
    }
      


    setLoading(true)
    setError("")
    try {
      await axios.post("http://localhost:8000/thought/save", {
        user_id: userId,
        title,
        content
      })
      setContent("")
      setTitle("")
    } catch (err) {
      setError("Failed to save thought.")
    } finally {
      setLoading(false)
    }
  }

  const handleContinue = async () => {
    if (!content || !userId) {
      setError("Please enter a thought to continue.")
      return
    }

    setLoading(true)
    setError("")
    try {
      const res = await axios.post("http://localhost:8000/thought/continue", {
        user_id: userId,
        thought: content
      })
      setContinued(res.data.continuation)
    } catch (err) {
      setError("Failed to continue thought.")
    } finally {
      setLoading(false)
    }
  }

return (
  <>
    <div className="mb-4">
  <label className="block font-semibold mb-1">Semantic Search</label>
  <input
    type="text"
    className="w-full p-2 border rounded-md"
    placeholder="Search your ideas by meaning..."
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
    onKeyDown={async (e) => {
      if (e.key === "Enter" && searchQuery.length > 3) {
        try {
          const res = await axios.post("http://localhost:8000/thought/search", {
            user_id: userId,
            query: searchQuery
          });
          setSearchResults(res.data.matches.map((m: any) => m.title));
        } catch {
          setError("Search failed.");
        }
      }
    }}
  />
</div>)
{searchResults.length > 0 && (
  <div className="mb-4">
    <p className="font-semibold text-sm mb-1">Top Matches:</p>
    <ul className="list-disc list-inside text-sm">
      {searchResults.map((title) => (
        <li key={title}>
          <button
            className="text-blue-600 hover:underline"
            onClick={async () => {
              setSelected(title);
              const res = await axios.get(`http://localhost:8000/thought/${userId}/${title}`);
              setTitle(res.data.title);
              setContent(res.data.content);
            }}
          >
            {title}
          </button>
        </li>
      ))}
    </ul>
  </div>
)}
  {thoughts.length > 0 && (
        <div className="mb-4">
          <label className="block font-semibold mb-1">Load Saved Thought</label>
          <select
            className="w-full p-2 border rounded-md"
            value={selected}
            onChange={async (e) => {
              const title = e.target.value
              setSelected(title)
              try {
                const res = await axios.get(`http://localhost:8000/thought/${userId}/${title}`)
                setTitle(res.data.title)
                setContent(res.data.content)
              } catch {
                setError("Failed to load thought.")
              }
            }}
          >
            <option value="">-- Select a thought --</option>
            {thoughts.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
      )}
      
    <div className="max-w-3xl mx-auto bg-white shadow-xl rounded-xl p-6 space-y-6">
      <h2 className="text-xl font-bold">🧠 Thought Continuation</h2>

      <input
        type="text"
        className="w-full p-2 border rounded-md"
        placeholder="Thought Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <textarea
        className="w-full p-3 border rounded-md resize-y min-h-[100px]"
        placeholder="Write a partial thought, journal entry, idea..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      <div className="flex gap-4">
        <button
          onClick={handleSave}
          disabled={loading}
          className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-900"
        >
          Save Thought
        </button>

        <button
          onClick={handleContinue}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {loading ? "Continuing..." : "Continue This Thought"}
        </button>
      </div>

      {error && <p className="text-red-600">{error}</p>}

      {continued && (
        <div className="bg-gray-50 border p-4 rounded-md">
          <p className="font-semibold">AI Continuation:</p>
          <pre className="whitespace-pre-wrap text-sm">{continued}</pre>
          </div>
        )})
      </div>
      </>
    );
  }
  function customUseEffect(callback: () => void, dependencies: any[]) {
      reactUseEffect(callback, dependencies)
    }

