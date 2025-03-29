import { useEffect, useState } from 'react'
import { getFlowSuggestions } from './flowApi'
import FlowBlock from './components/FlowBlock'
import RhythmScore from './components/RhythmScore'
import SmartPlannerToolbar from './components/SmartPlannerToolbar'

export default function FlowForge() {
  const [blocks, setBlocks] = useState([])

  useEffect(() => {
    getFlowSuggestions().then(setBlocks)
  }, [])

  return (
    <div className="p-4 bg-white rounded-2xl shadow">
      <h2 className="text-lg font-bold mb-4">🧠 FlowForge — AI Synced Planner</h2>
      <SmartPlannerToolbar onRefresh={() => getFlowSuggestions().then(setBlocks)} />
      <RhythmScore blocks={blocks} />
      <div className="mt-4 grid gap-3">
        {blocks.map((block, i) => (
          <FlowBlock key={i} block={block} />
        ))}
      </div>
    </div>
  )
}
