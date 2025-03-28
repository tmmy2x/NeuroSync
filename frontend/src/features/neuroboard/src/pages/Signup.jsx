import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useNavigate } from 'react-router-dom'

export default function Signup() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [orgName, setOrgName] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSignup = async (e) => {
    e.preventDefault()
    setError('')

    const { data, error: signupError } = await supabase.auth.signUp({
      email,
      password
    })

    if (signupError) return setError(signupError.message)

    // Wait for session to exist (email verification optional)
    const sessionRes = await supabase.auth.getSession()
    const user = sessionRes.data?.session?.user

    if (!user) return setError('Signup success, but user not active yet.')

    // Create org and link membership
    const { data: org, error: orgErr } = await supabase
      .from('organizations')
      .insert([{ name: orgName }])
      .select()
      .single()

    if (orgErr) return setError(orgErr.message)

    await supabase.from('memberships').insert([{
      user_id: user.id,
      organization_id: org.id,
      role: 'admin'
    }])

    navigate('/')
  }

  return (
    <div className="max-w-sm mx-auto mt-20 bg-white p-6 rounded-xl shadow">
      <h2 className="text-xl font-bold mb-4">🆕 Create Account</h2>
      <form onSubmit={handleSignup} className="space-y-3">
        <input
          type="text"
          placeholder="Organization Name"
          value={orgName}
          onChange={e => setOrgName(e.target.value)}
          required
          className="border w-full p-2 rounded"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          className="border w-full p-2 rounded"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          className="border w-full p-2 rounded"
        />
        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">
          Sign Up
        </button>
        {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
      </form>
    </div>
  )
}
