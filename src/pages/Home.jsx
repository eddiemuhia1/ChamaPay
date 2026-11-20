import { signOut } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'
import { auth } from '../firebase'
import { useAuth } from '../context/AuthContext'
import TreasurerDashboard from '../components/TreasurerDashboard'
import MemberDashboard from '../components/MemberDashboard'


function Home (){
    const {user, role} = useAuth()
    const navigate = useNavigate()

    const handleLogOut = async() => {
        await signOut (auth)
        navigate('/login')
    }
    
    return(
        <div className="relative flex justify-center p-4 pt-10">
          <div className="absolute right-6 top-4 flex items-center gap-4">
            <span className="hidden text-sm text-gray-600 sm:inline">
              {user ? user.email : "nobody"}  
            </span>
             <button type="button" onClick={handleLogOut} className="mt-6 rounded-lg bg-blue-700 px-4 py-3 font-semibold text-white">Log Out</button> 
           </div> 
          <div className="w-full max-w-sm">   
         {role === "treasurer" && <TreasurerDashboard />}
         {role === "member" && <MemberDashboard />}
         {!role && <p className="mt-4 text-gray-600">Setting up your account...</p>} 
         </div>   
       </div>
    )

}
export default Home