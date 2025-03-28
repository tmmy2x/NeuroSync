import { useEffect, useState } from 'react'

export default function NudgeControlPanel() {
  const [config, setConfig] = useState({
    tone: 'Empathetic',
    praise_template: '',
    break_template: '',
  })

  useEffect(() => {
    fetch('http://localhost:8000/api/nudge-config')
      .then(res => res.json())
      .then(setConfig)
  }, [])

  const updateField = (key, value) => {
    setConfig(prev => ({ ...prev, [key]: value }))
  }

  const save = async () => {
    await fetch('http://localhost:8000/api/nudge-config', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config),
    })
    alert('Nudge config saved!')
  }

  return (
    <div className="bg-white p-4 rounded-2xl shadow max-w-xl mx-auto mt-6">
      <h2 className="text-lg font-bold mb-4">Admin Nudge Control Panel</h2>

      <label className="block text-sm mb-1">Tone Preset</label>
      <select
        className="w-full mb-3 border p-2 rounded"
        value={config.tone}
        onChange={(e) => updateField('tone', e.target.value)}
      >
        <option value="Empathetic">Empathetic</option>
        <option value="Friendly">Friendly</option>
        <option value="Professional">Professional</option>
      </select>

      <label className="block text-sm mb-1">Praise Template</label>
      <textarea
        className="w-full mb-3 border p-2 rounded"
        rows={2}
        value={config.praise_template}
        onChange={(e) => updateField('praise_template', e.target.value)}
      />

      <label className="block text-sm mb-1">Break Template</label>
      <textarea
        className="w-full mb-3 border p-2 rounded"
        rows={2}
        value={config.break_template}
        onChange={(e) => updateField('break_template', e.target.value)}
      />

      <button
        onClick={save}
        className="bg-blue-600 text-white px-4 py-2 rounded text-sm"
      >
        Save Config
      </button>
    </div>
  )
}
