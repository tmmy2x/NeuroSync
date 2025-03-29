import { useState, useEffect } from 'react'
import axios from 'axios'

export default function StyleForm() {
  const [samples, setSamples] = useState(["", "", ""])
  const [loading, setLoading] = useState(false)
  const [profile, setProfile] = useState<any>(null)
  const [error, setError] = useState("")
  const [userId, setUserId] = useState(() => {
    return localStorage.getItem("echotwin_user_id") || ""
  })
  const [idError, setIdError] = useState("")

  

  useEffect(() => {
    const loadExistingProfile = async () => {
        localStorage.setItem("echotwin_user_id", userId)
        const cachedTraits = localStorage.getItem("echotwin_profile")
    if (cachedTraits) {
      setProfile({ traits: JSON.parse(cachedTraits) })
      return
    }
      try {
        const res = await axios.get(`http://localhost:8000/style-profile/${userId}`)
        setProfile({ traits: res.data.traits })
        localStorage.setItem("echotwin_profile", JSON.stringify(res.data.traits))
      } catch (err) {
        console.log("No saved profile found.")
      }
    }

    loadExistingProfile()
  }, [])

  const handleClear = async () => {
    try {
        await axios.delete(`http://localhost:8000/style-profile/${userId}`)

      // 🧼 Clear localStorage
    localStorage.removeItem("echotwin_user_id")
    localStorage.removeItem("echotwin_profile")

    // 🧹 Reset frontend state
      setProfile(null)
      setSamples(["", "", ""])
      setError("")
    } catch (err) {
      setError("Failed to delete profile.")
    }
  }
  

  const handleChange = (value: string, index: number) => {
    const newSamples = [...samples]
    newSamples[index] = value
    setSamples(newSamples)
  }

  const addSample = () => setSamples([...samples, ""])

  if (!/^[a-zA-Z0-9_-]{3,}$/.test(userId)) {
    setIdError("Echo ID must be at least 3 characters and contain only letters, numbers, dashes, or underscores.")
    return
  }
  
  setIdError("")  // Clear if valid
  

  const handleSubmit = async () => {
    localStorage.setItem("echotwin_user_id", userId)

    if (samples.filter(s => s.trim()).length < 3) {
      setError("Please enter at least 3 writing samples.")
      return
    }

    setLoading(true)
    setError("")
    setProfile(null)

    try {
      const res = await axios.post(`http://localhost:8000/style-profile/`, {
        user_id: userId,
        samples: samples.filter(s => s.trim()),
      })
      setProfile(res.data.tone_profile)
      localStorage.setItem("echotwin_user_id", userId)
localStorage.setItem("echotwin_profile", JSON.stringify(res.data.tone_profile.traits))

    } catch (err: any) {
      setError(err.response?.data?.detail || "Something went wrong.")
    } finally {
      setLoading(false)
    }
  }

  return (
<div>
  <div className="mb-4">
    <label className="block font-semibold mb-1">Your Echo ID</label>
    <input
      type="text"
      className="w-full p-2 border rounded-md"
      placeholder="e.g. timmy-ai"
      value={userId}
      onChange={(e) => setUserId(e.target.value.trim())}
    />
    {idError && <p className="text-red-600 text-sm mt-1">{idError}</p>}
  </div>

  <div className="max-w-3xl mx-auto bg-white shadow-xl rounded-xl p-6 space-y-6">
    <h2 className="text-xl font-semibold">Enter Your Writing Samples</h2>

    {samples.map((sample, i) => (
      <textarea
        key={i}
        className="w-full p-3 border rounded-md resize-y min-h-[100px]"
        placeholder={`Sample #${i + 1}`}
        value={sample}
        onChange={(e) => handleChange(e.target.value, i)}
      />
    ))}

    <button
      onClick={addSample}
      className="text-sm text-blue-600 hover:underline"
    >
      + Add another sample
    </button>

    <button
      onClick={handleSubmit}
      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      disabled={loading}
    >
      {loading ? "Analyzing..." : "Generate Style Profile"}
    </button>

    <button
      onClick={handleClear}
      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
    >
      Clear My Profile
    </button>

    {error && (
      <p className="text-red-600 font-medium">{error}</p>
    )}

    {profile && (
      <div className="bg-gray-50 border p-4 rounded-md overflow-x-auto">
        <pre className="whitespace-pre-wrap text-sm">
          {JSON.stringify(profile.traits, null, 2)}
        </pre>
      </div>
    )}
  </div>
</div>
  )
}
