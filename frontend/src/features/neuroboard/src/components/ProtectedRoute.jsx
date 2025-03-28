import { Navigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'

export default function ProtectedRoute({ children }) {
  const { user } = useAuth()

  if (user === null) return <Navigate to="/login" replace />
  return children
}
