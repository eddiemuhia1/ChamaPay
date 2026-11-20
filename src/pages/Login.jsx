import { auth, googleProvider } from "../firebase";
import { useNavigate, Navigate, Link } from "react-router-dom"; // Added Link here
import { signInWithPopup, signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      console.log("Success! Logged in as:", result.user.displayName);
      navigate("/home");
    } catch (error) {
      console.error("Error signing in:", error.message);
    }
  };

  const handleSignInWithEmailAndPassword = async () => {
    setError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/home");
    } catch (error) {
      console.error("Error logging in:", error.message);
      setError("Could not log in. Check your email and password.");
    }
  };

  if (user) {
    return <Navigate to="/home" replace />;
  }

  return (

    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-sm border border-gray-100 flex flex-col gap-6">
        
        <div className="text-center">
          {/* Optional: You can put a logo icon here later */}
          <h1 className="text-3xl font-bold text-gray-900">Chama App</h1>
          <p className="mt-2 text-sm text-gray-500">Track contributions. Remind members.</p>
        </div>

        {/* Display the error message if one exists */}
        {error && (
          <div className="rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-sm font-medium text-gray-700">Email</label>
            <input id="email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)}
              className="rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"/>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="password" className="text-sm font-medium text-gray-700">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
            />
          </div>

          <button onClick={handleSignInWithEmailAndPassword} className="mt-2 rounded-lg bg-[#1d63b8] py-3 font-semibold text-white transition-colors hover:bg-blue-800">
            Log in
          </button>
        </div>

        <div className="flex items-center gap-3">
          <hr className="flex-1 border-gray-200" />
          <p className="text-sm text-gray-400">or</p>
          <hr className="flex-1 border-gray-200" />
        </div>

        <button onClick={handleGoogleSignIn} type="button" className="rounded-lg border border-gray-300 bg-white py-3 font-semibold text-gray-700 transition-colors hover:bg-gray-50">
          Continue with Google
        </button>

        <p className="mt-2 text-center text-sm text-gray-600">
          New here?{" "}
          <Link to="/signup" className="font-semibold text-[#1d63b8] hover:underline">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;