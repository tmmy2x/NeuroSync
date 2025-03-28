import { useState } from 'react'

export default function Login({ onLogin }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const login = async () => {
    const res = await fetch('http://localhost:8000/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    })
    const data = await res.json()
    if (data.access_token) {
      localStorage.setItem('token', data.access_token)
      onLogin({ username, role: data.role }) // Optional
    }
  }

  return (
    <div className="flex flex-col gap-2 max-w-xs mx-auto mt-10">
      <input
        placeholder="Username"
        value={username}
        onChange={e => setUsername(e.target.value)}
        className="p-2 border rounded"
      />
      <input
        placeholder="Password"
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        className="p-2 border rounded"
      />
      <button onClick={login} className="bg-blue-600 text-white p-2 rounded">Login</button>
    </div>
  )
}
