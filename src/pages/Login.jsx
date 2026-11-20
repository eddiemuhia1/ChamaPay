import { auth, googleProvider } from "../firebase";
import { useNavigate, Navigate } from "react-router-dom";
import { signInWithPopup, signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

function Login (){
  const navigate = useNavigate()
  const { user } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup (auth, googleProvider);
      console.log("Success! Logged in as:", result.user.displayName)
      navigate("/home");
    } catch (error) {
      console.error("Error signing in:", error.message)
    }
  }
  const handleSignInWithEmailAndPassword = async () => {
    setError("")
    try {
      await signInWithEmailAndPassword(auth, email, password)
      navigate("/home")
    } catch (error) {
      console.error("Error logging in:", error.message)
       setError("Could not log in. Check your email and password.");
      
    }
  }
  if (user) {
   return <Navigate to="/home" replace />;
}
 
    return(
        <div className='min-h-screen items-center bg-gray-50 justify-center p-6'>
         <div className="flex flex-col gap-5">   
           <div className="text-center">
             <h1 className='font-bold text-3xl'>Chama App</h1>
             <p className="mt-1 text-gray-650">Track contributions. Remind Members</p>
           </div> 
           <div className="flex flex-col gap-1">
             <label htmlFor="email">Email</label>
             <input id="email" type="email" placeholder="you@example.com" 
              value={email} onChange={(e) => setEmail(e.target.value)} className="rounded-lg border border-grey-400 px-2 py-2" />
           </div>
            <div className="flex flex-col gap-1">
             <label htmlFor="password">Password</label>
             <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              className="rounded-lg border border-gray-400 px-2 py-2" />
           </div>
           <button onClick={handleSignInWithEmailAndPassword} className="rounded-lg bg-blue-700 py-3 font-semibold text-white"> Login</button>
            <p className="text-sm text-center">or</p>
           <button onClick={handleGoogleSignIn} type="button" className="rounded-lg border border-gray-400">Continue with Google</button>

           <p className="text-center">New here? <a href="#" className="font-semibold text-blue-700" >Create Account</a></p>      
         </div>
        </div>
    )
}
export default Login