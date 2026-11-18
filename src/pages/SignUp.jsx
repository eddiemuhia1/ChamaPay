function SignUp (){
    return(
        <div className='min-h-screen items-center bg-gray-50 justify-center p-6'>
         <div className="flex flex-col gap-5">
           <div className="text-center">
             <h1 className="font-bold text-3xl">Create Your Account</h1>
             <p className="mt-1 text-gray-600">Join Your Chama on ChamaPay </p>
           </div> 
           <div className="flex flex-col gap-1">
            <label htmlFor="name" className="text-sm font-semibold">Full Name</label>
            <input type="name" id="name" className="rounded-lg border border-grey-400 px-2 py-2"  />
           </div>

           <div className="flex flex-col gap-1">
            <label htmlFor="email" className="text-sm font-semibold">Email</label>
            <input type="email" id="email" placeholder="you@example.com" className="rounded-lg border border-grey-400 px-2 py-2"  />
           </div>

           <div className="flex flex-col gap-1">
            <label htmlFor="name" className="text-sm font-semibold">Password</label>
            <input type="password" id="password" className="rounded-lg border border-grey-400 px-2 py-2"  />
           </div>

           <div className="flex flex-col gap-1">
             <label htmlFor="role">I am a</label>
             <select className="rounded-lg border border-gray-400 bg-white px-3 py-3">
                 <option>Member</option>
                 <option>Treasurer</option>
             </select>  
           </div>

           <button className="rounded-lg bg-blue-700 py-3 font-semibold text-white">Create Account</button>
           <p  >
             Already have an account? <br/>
              <a href="#" className="font-semibold text-blue-700">Login</a>
           </p>
         </div>  
        </div>
    )
 
}
export default SignUp