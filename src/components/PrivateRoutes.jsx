import { Outlet, Navigate } from "react-router"
import { useAuth } from "../context/AuthContext"

function PrivateRoutes() {
  const { isAuthenticated, loading } = useAuth()

  // Avoid redirecting before the session is restored from localStorage
  if (loading) return <p>Loading...</p>

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />
}

export default PrivateRoutes