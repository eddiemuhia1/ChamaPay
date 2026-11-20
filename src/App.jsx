import { useState } from 'react'
import { Route, Routes, Link } from 'react-router'
import PrivateRoutes from './components/PrivateRoutes'
import SignUp from './pages/SignUp'
import Login from './pages/Login'
import Home from './pages/Home'
import MemberDashboard from './components/MemberDashboard'

function App() {
  const [count, setCount] = useState(0)

  return (
   <div className="min-h-screen bg-gray-60">    

    <nav className='flex items-center justify-between bg-white px-6 py-4'>
     <h1 className='text-2xl font-bold text-blue-700'>ChamaPay</h1> 
      
     <div className="flex gap-4 text-sm font-medium text-gray-600">
      <Link to="/home" className="border-b-2 border-transparent pb-1 transition-colors hover:border-blue-700 hover:text-blue-700">Home</Link> 
      <Link to="/login" className="border-b-2 border-transparent pb-1 transition-colors hover:border-blue-700 hover:text-blue-700"  >Login</Link> 
      <Link to="/signup" className="border-b-2 border-transparent pb-1 transition-colors hover:border-blue-700 hover:text-blue-700" >Sign Up</Link> 
       <Link to="/member" className="border-b-2 border-transparent pb-1 transition-colors hover:border-blue-700 hover:text-blue-700" >Member View</Link> 
     </div> 
    </nav> 
  
    <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />

        {/* Protected routes — anything inside this route requires auth */}
        <Route element={<PrivateRoutes />}>
          <Route path="/home" element={<Home />} />
           <Route path="/member" element={<MemberDashboard />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<h2>404 - Page Not Found</h2>} />
      </Routes>
   </div>  
 
  )
}

export default App
