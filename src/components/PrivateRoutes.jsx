import { Outlet, Navigate } from "react-router"
import { useAuth } from "../context/AuthContext"

function PrivateRoutes() {
  const { user, loading } = useAuth()

  // Avoid redirecting before the session is restored from localStorage
  if (loading) return <p>Loading...</p>

  return user ? <Outlet /> : <Navigate to="/login" replace />
}

export default PrivateRoutes