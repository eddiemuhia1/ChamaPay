import { signOut } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'
import { auth } from '../firebase'
import { useAuth } from '../context/AuthContext'


function Home (){
    const {user} = useAuth()
    const navigate = useNavigate()

    const handleLogOut = async() => {
        await signOut (auth)
        navigate('/login')
    }
    
    return(
        <div className="min-h-screen bg-gray-100 p-6">
           <h1 className="text-3xl font-bold">Chama Hub</h1>
           <p className="mt-2">You are logged in as: {user ? user.email : "nobody"} </p>
           <button type="button" onClick={handleLogOut} className="mt-6 rounded-lg bg-blue-700 px-4 py-3 font-semibold text-white">Log Out</button> 
       </div>
    )

}
export default Home