import { useEffect, useState } from 'react'

export default function CommunicationMatrix() {
  const [flow, setFlow] = useState([])
  const [people, setPeople] = useState([])

  useEffect(() => {
    const fetchFlow = () => {
      fetch('http://localhost:8000/api/communication/flow')
        .then(res => res.json())
        .then(data => {
          setFlow(data.flow || [])
          const names = new Set()
          data.flow.forEach(f => {
            names.add(f.from)
            names.add(f.to)
          })
          setPeople([...names])
        })
    }
  
    fetchFlow()
    const interval = setInterval(fetchFlow, 60000) // every 60 sec
    return () => clearInterval(interval)
  }, [])
  

  return (
    <div className="bg-white p-4 rounded-2xl shadow overflow-x-auto">
      <h2 className="text-lg font-bold mb-3">🔄 Communication Flow Matrix</h2>
      <table className="table-auto border-collapse text-sm min-w-[400px]">
        <thead>
          <tr>
            <th className="border px-3 py-2 bg-gray-100">From ↓ / To →</th>
            {people.map((p) => (
              <th key={p} className="border px-3 py-2 bg-gray-50 text-center">{p}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {people.map((sender) => (
            <tr key={sender}>
              <td className="border px-3 py-2 font-semibold">{sender}</td>
              {people.map((receiver) => {
                const match = flow.find(f => f.from === sender && f.to === receiver)
                return (
                  <td key={receiver} className="border px-3 py-2 text-center">
                    {match ? match.messages : 0}
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
