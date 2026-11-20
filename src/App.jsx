import { useState } from 'react'
import { Route, Routes, Link } from 'react-router'
import PrivateRoutes from './components/PrivateRoutes'
import SignUp from './pages/SignUp'
import Login from './pages/Login'
import Home from './pages/Home'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <h1 className='text-3xl font-bold text-blue-600 p-6'>ChamaPay</h1>

    <nav>
      <Link to="/home">Home</Link> |
      <Link to="/login">Login</Link> |
      <Link to="/signup">Sign Up</Link> 
    </nav>
 
    <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />

        {/* Protected routes — anything inside this route requires auth */}
        <Route element={<PrivateRoutes />}>
          <Route path="/home" element={<Home />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<h2>404 - Page Not Found</h2>} />
      </Routes>
     
    </>
  )
}

export default App
