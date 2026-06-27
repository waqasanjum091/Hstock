import { Navigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'

export default function ProtectedRoute({ roles, children }) {
  const { user, isAuthenticated } = useApp()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (roles && user?.roles) {
    const hasRole = roles.some((r) => user.roles.includes(r))
    if (!hasRole) {
      return <Navigate to="/" replace />
    }
  }

  return children
}
