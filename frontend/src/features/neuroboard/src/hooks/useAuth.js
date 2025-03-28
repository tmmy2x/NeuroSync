import { useEffect, useState } from 'react'
import { supabase } from './supabaseClient'

export function useAuth() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const session = supabase.auth.getSession()
    session.then(({ data: { session } }) => setUser(session?.user || null))

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null)
    })

    return () => listener?.subscription.unsubscribe()
  }, [])

  return { user, supabase }
}
