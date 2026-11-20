import { useState } from 'react'
import { Route, Routes, Link } from 'react-router'
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
      <Route path="/home" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
    </Routes>
   
     
    </>
  )
}

export default App
