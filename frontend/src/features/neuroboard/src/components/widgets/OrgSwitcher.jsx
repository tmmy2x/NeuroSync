import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function OrgSwitcher({ user, onSwitch }) {
  const [orgs, setOrgs] = useState([])
  const [active, setActive] = useState(null)

  useEffect(() => {
    const fetchOrgs = async () => {
      const { data, error } = await supabase
        .from('memberships')
        .select('organization_id, organizations(name)')
        .eq('user_id', user.id)

      if (data) {
        setOrgs(data)
        setActive(data[0]?.organization_id)
        onSwitch(data[0]?.organization_id)
      }
    }

    fetchOrgs()
  }, [user])

  return (
    <select
      className="border p-1 rounded text-sm"
      value={active}
      onChange={(e) => {
        setActive(e.target.value)
        onSwitch(e.target.value)
      }}
    >
      {orgs.map((o) => (
        <option key={o.organization_id} value={o.organization_id}>
          {o.organizations.name}
        </option>
      ))}
    </select>
  )
}
