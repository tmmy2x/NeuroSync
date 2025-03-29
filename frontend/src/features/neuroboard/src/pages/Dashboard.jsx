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
import CalendarHeatmap from '../components/widgets/CalendarHeatmap'
import OrgSwitcher from '../components/widgets/OrgSwitcher'
import { useEffect, useState } from 'react'

export default function Dashboard({ user }) {
  const [hasData, setHasData] = useState(true)
  const isAdmin = user?.role === 'admin'

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
        <button
          className="mt-4 bg-green-600 text-white px-4 py-2 rounded"
          onClick={() => fetch('http://localhost:8000/api/seed-org', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ organization_id: 'currentOrgId' }) // Replace with actual org ID
          })}
        >
          🌱 Seed Demo Data
        </button>
      </div>
    )
  }

  return (
    <DashboardLayout>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
        <TeamOverview />
        <EmotionalRadar />
        <MoodHeatmap />
        <ManagerNudges />
        <BurnoutRiskGauge />
        <NudgeLogHistory />
        <NotificationInbox username={user?.username || 'Guest'} />
        <Leaderboard />
        <CommunicationMatrix />
        <ResponseLagAnalyzer />
        <GamificationPanel />
        <TopStressDays />
        <EmotionalDiversityIndex />
        <BurnoutPredictionChart />
        <OrgSwitcher user={user} onSwitch={(orgId) => console.log('Switching to org:', orgId)} />
      </div>
      <div className="p-4">
        <TeamEmotionTrends />
      </div>
      {isAdmin && (
        <>
          <SlackChannelPicker />
          <NudgeControlPanel />
        </>
      )}
      <PraiseWall />
      <div className="h-[400px] md:h-[500px] overflow-x-auto">
        <CalendarHeatmap data={[]} />
      </div>
    </DashboardLayout>
  )
}