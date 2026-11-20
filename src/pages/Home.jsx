import { useAuth } from "../context/AuthContext"
function Home (){
    const {user} = useAuth()
    
    return(
        <div className="min-h-screen bg-gray-100 p-6">
           <h1 className="text-3xl font-bold">Chama Hub</h1>
           <p className="mt-2">You are logged in as: {user ? user.email : "nobody"} </p> 
       </div>
    )

}
export default Home