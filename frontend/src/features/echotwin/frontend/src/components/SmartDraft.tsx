import { useState } from 'react'
import axios from 'axios'

export default function SmartDraft() {
  const [prompt, setPrompt] = useState("")
  const [draftType, setDraftType] = useState("email")
  const [draft, setDraft] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const userId = localStorage.getItem("echotwin_user_id") || ""

  const handleGenerate = async () => {
    if (!userId || prompt.trim().length < 5) {
      setError("Please enter a valid Echo ID and prompt.")
      return
    }

    setLoading(true)
    setError("")
    setDraft("")

    try {
      const res = await axios.post("http://localhost:8000/draft", {
        user_id: userId,
        type: draftType,
        prompt: prompt.trim()
      })
      setDraft(res.data.draft)
    } catch (err) {
      setError("Failed to generate draft.")
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(draft)
  }

  return (
    <div className="max-w-3xl mx-auto bg-white shadow-xl rounded-xl p-6 space-y-6">
      <h2 className="text-xl font-bold">Smart Draft Generator ✨</h2>

      <textarea
        className="w-full p-3 border rounded-md resize-y min-h-[100px]"
        placeholder="What do you want to say?"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />

      <div className="flex items-center gap-4">
        <select
          value={draftType}
          onChange={(e) => setDraftType(e.target.value)}
          className="border p-2 rounded-md"
        >
          <option value="email">Email</option>
          <option value="message">Message</option>
          <option value="note">Note</option>
        </select>

        <button
          onClick={handleGenerate}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {loading ? "Generating..." : "Generate Draft"}
        </button>

        <div className="mt-4 flex gap-3 flex-wrap">
  {["Make it more concise", "Make it more formal", "Add warmth"].map((label) => (
    <button
      key={label}
      onClick={() => handleRefine(label)}
      className="bg-gray-200 text-sm px-3 py-1 rounded hover:bg-gray-300"
    >
      {label}
    </button>
  ))}
</div>
  
      </div>

      {error && <p className="text-red-600">{error}</p>}

      {draft && (
        <div className="border rounded-md p-4 bg-gray-50">
          <pre className="whitespace-pre-wrap text-sm">{draft}</pre>
          <button
            onClick={copyToClipboard}
            className="mt-2 text-sm text-blue-600 hover:underline"
          >
            Copy to Clipboard
          </button>
          const handleRefine = async (instruction: string) => {
  if (!draft) return

  setLoading(true)
  setError("")

  try {
    const res = await axios.post("http://localhost:8000/draft/refine", {
      draft,
      refinement: instruction
    })
    setDraft(res.data.refined)
  } catch (err) {
    setError("Refinement failed.")
  } finally {
    setLoading(false)
  }
}

        </div>
      )}
    </div>
  )
}
