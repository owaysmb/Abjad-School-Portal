
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

interface Props {
  children: React.ReactNode
  role: string
}

const ProtectedRoute = ({ children, role }: Props) => {
  const auth = useAuth()
  const user = auth?.user

  if (!user) return <Navigate to="/login" />
  if (user.role !== role) return <Navigate to="/login" />

  return <>{children}</>
}

export default ProtectedRoute