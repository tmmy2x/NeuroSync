import { useEffect, useState } from 'react'
import CalendarHeatmap from 'react-calendar-heatmap'
import 'react-calendar-heatmap/dist/styles.css'
import { subDays, format, parseISO } from 'date-fns'

const EMOTION_LABELS = ['joy', 'sadness', 'anger', 'fear', 'surprise', 'calm']

export default function MoodHeatmap() {
  const [rawData, setRawData] = useState({})
  const [heatmapData, setHeatmapData] = useState([])
  const [selectedUser, setSelectedUser] = useState('all')
  const [selectedEmotion, setSelectedEmotion] = useState('average')

  useEffect(() => {
    fetch('http://localhost:8000/api/team-emotions/history')
      .then(res => res.json())
      .then(setRawData)
  }, [])

  useEffect(() => {
    if (!rawData || Object.keys(rawData).length === 0) return

    const aggregated = {}

    for (const [name, entries] of Object.entries(rawData)) {
      if (selectedUser !== 'all' && name !== selectedUser) continue

      entries.forEach(entry => {
        const day = format(parseISO(entry.timestamp), 'yyyy-MM-dd')

        let value
        if (selectedEmotion === 'average') {
          const sum = Object.values(entry.emotions).reduce((a, b) => a + b, 0)
          value = sum / Object.keys(entry.emotions).length
        } else {
          value = entry.emotions[selectedEmotion] || 0
        }

        const key = `${name}|${day}`
        aggregated[key] = (aggregated[key] || 0) + value
      })
    }

    const formatted = Object.entries(aggregated).map(([key, total]) => {
      const [name, date] = key.split('|')
      return {
        date,
        count: Math.round(total / 100),
        name,
      }
    })

    setHeatmapData(formatted)
  }, [rawData, selectedUser, selectedEmotion])

  const today = new Date()
  const startDate = subDays(today, 30)

  return (
    <div className="bg-white p-4 rounded-2xl shadow">
      <h2 className="text-lg font-bold mb-4">Mood Heatmap</h2>

      <div className="flex flex-wrap gap-4 mb-4 items-center">
        {/* User Filter */}
        <select
          className="p-2 border rounded text-sm"
          value={selectedUser}
          onChange={(e) => setSelectedUser(e.target.value)}
        >
          <option value="all">All Users</option>
          {Object.keys(rawData).map((user) => (
            <option key={user} value={user}>
              {user}
            </option>
          ))}
        </select>

        {/* Emotion Filter */}
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setSelectedEmotion('average')}
            className={`px-3 py-1 rounded text-xs font-medium ${
              selectedEmotion === 'average'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            Overall
          </button>
          {EMOTION_LABELS.map((emotion) => (
            <button
              key={emotion}
              onClick={() => setSelectedEmotion(emotion)}
              className={`px-3 py-1 rounded text-xs font-medium capitalize ${
                selectedEmotion === emotion
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              {emotion}
            </button>
          ))}
        </div>
      </div>

      {heatmapData.length > 0 ? (
        <CalendarHeatmap
          startDate={startDate}
          endDate={today}
          values={heatmapData}
          classForValue={(value) => {
            if (!value) return 'color-empty'
            if (value.count >= 4) return 'color-scale-4'
            if (value.count >= 3) return 'color-scale-3'
            if (value.count >= 2) return 'color-scale-2'
            return 'color-scale-1'
          }}
          tooltipDataAttrs={(value) =>
            value.date
              ? {
                  'data-tip': `${value.name} | ${value.date} | Mood Score: ${value.count}`,
                }
              : {}
          }
          showWeekdayLabels
        />
      ) : (
        <p className="text-gray-500">Loading mood history...</p>
      )}
    </div>
  )
}
