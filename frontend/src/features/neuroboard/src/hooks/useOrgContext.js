import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export function useOrgContext(user) {
  const [org, setOrg] = useState(null)
  const [role, setRole] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOrg = async () => {
      if (!user) return

      const { data, error } = await supabase
        .from('memberships')
        .select('organization_id, role')
        .eq('user_id', user.id)
        .single()

      if (!error) {
        setOrg(data.organization_id)
        setRole(data.role)
      }

      setLoading(false)
    }

    fetchOrg()
  }, [user])

  return { org, role, loading }
}
