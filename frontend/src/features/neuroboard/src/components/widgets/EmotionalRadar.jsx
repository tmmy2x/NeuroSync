import { Radar } from 'react-chartjs-2'
import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from 'chart.js'
import mockTeamEmotions from '../../data/mockTeamEmotions'
import { useEffect, useState } from 'react'
import useWebSocket from 'react-use-websocket'

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend)

export default function EmotionalRadar() {
    const emotionLabels = ['joy', 'sadness', 'anger', 'fear', 'surprise', 'calm']
    
    const [teamData, setTeamData] = useState([])

    const { lastJsonMessage } = useWebSocket('ws://localhost:8000/ws/emotions', {
        onOpen: () => console.log('WebSocket connected'),
        shouldReconnect: () => true,
      })

      useEffect(() => {
        if (lastJsonMessage?.team) {
          setTeamData(lastJsonMessage.team)
        }
      }, [lastJsonMessage])

    useEffect(() => {
        const fetchData = () => {
          fetch('http://localhost:8000/api/team-emotions')
            .then((res) => res.json())
            .then((data) => setTeamData(data.team))
            .catch((err) => console.error('Failed to fetch emotion data', err))
        }
    
        fetchData() // initial load
        const interval = setInterval(fetchData, 10000) // every 10s
    
        return () => clearInterval(interval)
      }, [])

      const datasets = teamData.map((member, i) => ({
        label: member.name,
        data: EMOTION_LABELS.map((e) => member.emotions[e]),
        fill: true,
        borderColor: `hsl(${i * 120}, 70%, 50%)`,
        backgroundColor: `hsla(${i * 120}, 70%, 50%, 0.2)`,
        pointBackgroundColor: `hsl(${i * 120}, 70%, 50%)`,
        tension: 0.2,
      }))
    
      const chartData = {
        labels: EMOTION_LABELS.map(e => e.charAt(0).toUpperCase() + e.slice(1)),
        datasets,
      }
    
      const chartOptions = {
        scales: {
          r: {
            suggestedMin: 0,
            suggestedMax: 100,
            ticks: { stepSize: 20, color: '#6b7280' },
            pointLabels: { color: '#374151', font: { size: 12 } },
          }
        },
        plugins: {
          legend: { position: 'top', labels: { color: '#374151' } },
        },
        responsive: true,
        maintainAspectRatio: false,
      }

    const datasets = mockTeamEmotions.map((member, i) => ({
        label: member.name,
        data: emotionLabels.map((e) => member.emotions[e]),
        fill: true,
        borderColor: `hsl(${i * 120}, 70%, 50%)`,
        backgroundColor: `hsla(${i * 120}, 70%, 50%, 0.2)`,
        pointBackgroundColor: `hsl(${i * 120}, 70%, 50%)`,
        tension: 0.2,
      }))
    
      const data = {
        labels: emotionLabels.map((e) => e.charAt(0).toUpperCase() + e.slice(1)),
        datasets,
      }
    
      const options = {
        scales: {
          r: {
            angleLines: { display: true },
            suggestedMin: 0,
            suggestedMax: 100,
            ticks: {
              stepSize: 20,
              backdropColor: 'transparent',
              color: '#6b7280',
            },
            pointLabels: {
              color: '#374151',
              font: { size: 12 },
            },
          },
        },
        plugins: {
          legend: {
            position: 'top',
            labels: { color: '#374151' },
          },
        },
        responsive: true,
        maintainAspectRatio: false,
      }
    
      return (
        <div className="bg-white p-4 rounded-2xl shadow h-[400px]">
          <h2 className="text-lg font-bold mb-2">Emotional Radar</h2>
          {teamData.length > 0 ? (
            <Radar data={chartData} options={chartOptions} />
          ) : (
            <p className="text-gray-500">Loading emotional data...</p>
          )}
        </div>
      )
    }   