import DashboardLayout from '../components/layout/DashboardLayout'
import TeamOverview from '../components/widgets/TeamOverview'
import EmotionalRadar from '../components/widgets/EmotionalRadar'
import MoodHeatmap from '../components/widgets/MoodHeatmap'
import ManagerNudges from '../components/widgets/ManagerNudges'
import TeamEmotionTrends from '../components/widgets/TeamEmotionTrends'
import BurnoutRiskGauge from '../components/widgets/BurnoutRiskGauge'
import NudgeLogHistory from '../components/widgets/NudgeLogHistory'
import { useSearchParams } from 'react-router-dom'
import NudgeControlPanel from '../components/widgets/NudgeControlPanel'
import NotificationInbox from '../components/widgets/NotificationInbox'
import PraiseWall from '../components/widgets/PraiseWall'
import GamificationPanel from '../components/widgets/GamificationPanel'
import Leaderboard from '../components/widgets/Leaderboard'
import CommunicationMatrix from '../components/widgets/CommunicationMatrix'
import ResponseLagAnalyzer from '../components/widgets/ResponseLagAnalyzer'
import SlackChannelPicker from '../components/widgets/SlackChannelPicker'
import TopStressDays from '../components/widgets/TopStressDays'
import EmotionalDiversityIndex from '../components/widgets/EmotionalDiversityIndex'
import BurnoutPredictionChart from '../components/widgets/BurnoutPredictionChart'



const [searchParams] = useSearchParams()
const isAdmin = searchParams.get('admin') === 'true'

{isAdmin && <NudgeControlPanel />}
{isAdmin && <GamificationPanel />}

import { useEffect, useState } from 'react'

export default function Dashboard() {
  const [hasData, setHasData] = useState(true)

  useEffect(() => {
    fetch('http://localhost:8000/api/emotion/summary')
      .then(res => res.json())
      .then(data => {
        setHasData(data && data.entries?.length > 0)
      })
  }, [])

  if (!hasData) {
    return (
      <div className="max-w-xl mx-auto text-center mt-20">
        <h2 className="text-2xl font-bold mb-2">👋 Welcome to NeuroBoard™</h2>
        <p className="text-gray-600">Your dashboard will come alive as soon as your team starts interacting.</p>
        <p className="text-sm mt-2 text-blue-600">You can seed mock data below 👇</p>
      </div>
    )
  }

  return (
    <div>
      {/* Normal dashboard content */}
    </div>
  )
}

<button
  className="mt-4 bg-green-600 text-white px-4 py-2 rounded"
  onClick={() => fetch('http://localhost:8000/api/seed-org', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ organization_id: currentOrgId })
  })}
>
  🌱 Seed Demo Data
</button>


export default function Dashboard() {
    return (
      <DashboardLayout>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
          <TeamOverview />
          <EmotionalRadar />
          <MoodHeatmap />
          <ManagerNudges />
          <BurnoutRiskGauge />
          <NudgeLogHistory />
          <NotificationInbox username="Jordan" />
          <Leaderboard />
          <CommunicationMatrix />
          <ResponseLagAnalyzer />
            <GamificationPanel />
            <TopStressDays />
            <EmotionalDiversityIndex />
            <BurnoutPredictionChart />
            <OrgSwitcher user={user} onSwitch={(orgId) => setCurrentOrg(orgId)} />
            

        </div>
        <div className="p-4">
          <TeamEmotionTrends />
        </div>
      </DashboardLayout>
    )
  }

  {isAdmin && (
    <>
      <SlackChannelPicker />
      ...
    </>
  )}

  export default function Dashboard({ user }) {
    const isAdmin = user.role === 'admin'
  
    return (
      <div className="p-4 space-y-6">
        <TeamOverview />
        <EmotionalRadar />
  
        {isAdmin ? (
          <>
            <ManagerNudges />
            <BurnoutRiskGauge />
            <NudgeControlPanel />
            <NudgeLogHistory />
          </>
        ) : (
          <>
            <NotificationInbox username={user.username} />
          </>
        )}
  
        <MoodHeatmap />
        <TeamEmotionTrends />
        <PraiseWall />
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
  <li className="w-full max-w-full ...">
  <div className="h-[400px] md:h-[500px] overflow-x-auto">
  <div className="overflow-x-auto">
  <CalendarHeatmap ... />
</div>
<div className="flex gap-2 flex-wrap justify-start sm:justify-center">
<ul className="border-l-2 border-blue-500 pl-4 space-y-4 text-sm">
  <li className="relative">
    <div className="absolute -left-[9px] top-1 w-3 h-3 bg-blue-500 rounded-full" />
    @media (max-width: 640px) {
  .timeline-dot {
    width: 0.5rem;
    height: 0.5rem;
    left: -6px;
  }
}

      </div>
    )
  }