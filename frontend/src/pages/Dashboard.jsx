import { useAuth } from '@/hooks/useAuth'
import { useOrgContext } from '@/hooks/useOrgContext'
import PulseSync from '@/features/pulsesync/PulseSyncDashboard'
import NeuroBoard from '@/features/neuroboard/NeuroBoardMain'

export default function Dashboard() {
  const { user } = useAuth()
  const { org, role } = useOrgContext(user)

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">NeuroSync OS</h1>
      {org ? (
        <>
          <PulseSync org={org} />
          <NeuroBoard org={org} role={role} />
        </>
      ) : (
        <p className="text-gray-500">Loading organization...</p>
      )}
    </div>
  )
}
