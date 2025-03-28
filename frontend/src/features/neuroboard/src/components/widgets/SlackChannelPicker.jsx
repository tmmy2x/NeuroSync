import { useEffect, useState } from 'react'

export default function SlackChannelPicker() {
  const [channels, setChannels] = useState([])
  const [selected, setSelected] = useState('')
  const [status, setStatus] = useState('')

  useEffect(() => {
    fetch('http://localhost:8000/api/slack/channels')
      .then(res => res.json())
      .then(data => setChannels(data.channels || []))
  }, [])

  const importChannel = async () => {
    if (!selected) return
    setStatus('Importing...')
    const res = await fetch(`http://localhost:8000/api/slack/import?channel_id=${selected}`, {
      method: 'POST',
    })
    const data = await res.json()
    setStatus(data.status ? `✅ Imported: ${data.imported?.length || 0}` : `❌ ${data.error}`)
  }

  return (
    <div className="bg-white p-4 rounded-2xl shadow mt-6 max-w-md">
      <h2 className="text-lg font-bold mb-2">🛰️ Slack Channel Import</h2>

      <select
        onChange={(e) => setSelected(e.target.value)}
        className="border p-2 rounded w-full mb-3"
      >
        <option value="">Select a Slack channel</option>
        {channels.map((c) => (
          <option key={c.id} value={c.id}>
            #{c.name}
          </option>
        ))}
      </select>

      <button
        onClick={importChannel}
        className="bg-blue-600 text-white px-4 py-2 rounded text-sm"
      >
        Import Messages
      </button>

      {status && <p className="mt-3 text-sm text-gray-700">{status}</p>}
    </div>
  )
}
