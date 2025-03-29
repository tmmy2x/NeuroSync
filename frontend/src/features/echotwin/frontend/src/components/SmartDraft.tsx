import { useState } from 'react'
import axios from 'axios'

const handleRefine = async (instruction: string, draft: string, setDraft: React.Dispatch<React.SetStateAction<string>>) => {
  if (!draft) return;

  setLoading(true);
  setError("");

  try {
    const res = await axios.post("http://localhost:8000/draft/refine", {
      draft,
      refinement: instruction,
    });
    setDraft(res.data.refined);
  } catch (err) {
    setError("Refinement failed.");
  } finally {
    setLoading(false);
  }
};

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
  
  // Add a button to use the copyToClipboard function
  <button
    onClick={copyToClipboard}
    disabled={!draft}
    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
  >
    Copy to Clipboard
  </button>



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
      onClick={() => handleRefine(label, draft, setDraft)}
      className="bg-gray-200 text-sm px-3 py-1 rounded hover:bg-gray-300"
    >
      {label}
    </button>
  ))}
</div>

        {error && (
          <div className="text-red-500 text-sm mt-2">
            {error}
          </div>
        )}
      </div>
    </div>
  )
}
// Removed redundant setLoading function definitions.
// Removed redundant setError function definition.
// Removed redundant setDraft function definition.

function setLoading(isLoading: boolean) {
  console.log("Loading state updated:", isLoading);
}
function setError(message: string) {
  console.error("Error:", message);
}
// Removed duplicate setError function implementation.

