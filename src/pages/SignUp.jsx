import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { createUserWithEmailAndPassword, updateProfile, signInWithPopup } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, googleProvider, db } from "../firebase";
import { useAuth } from "../context/AuthContext";

function Signup() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("member");
  const [error, setError] = useState("");

   const handleSignup = async () => {
    setError("");
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(result.user, { displayName: name });
      await setDoc(doc(db, "users", result.user.uid), { name, email, role });
      navigate("/home");
    } catch (err) {
      console.error("Error signing up:", err.code);
      if (err.code === "auth/email-already-in-use") {
        setError("That email already has an account.");
      } else if (err.code === "auth/weak-password") {
        setError("Password must be at least 6 characters.");
      } else {
        setError("Could not create your account. Check your details.");
      }
    }
  };

    const handleGoogleSignUp = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);

      const userRef = doc(db, "users", result.user.uid);

      const snap = await getDoc(userRef);
      if (!snap.exists()) {
        await setDoc(userRef, {
          name: result.user.displayName,
          email: result.user.email, role,
        });
      }
      navigate("/home");
    } catch (err) {
      console.error("Error signing up:", err.message);
    }
  };

  if (user) {
    return <Navigate to="/home" replace />;
  }


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-sm flex flex-col gap-5">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Create your account</h1>
          <p className="mt-1 text-gray-600">Join your chama on ChamaPay.</p>
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="name" className="text-sm font-semibold">Full name</label>
          <input id="name" type="text" placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)}
            className="rounded-lg border border-gray-400 px-3 py-3" />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="email" className="text-sm font-semibold">Email</label>
          <input id="email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)}
            className="rounded-lg border border-gray-400 px-3 py-3" />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="signup-password" className="text-sm font-semibold">Password</label>
          <input
            id="signup-password"
            type="password"
            placeholder="At least 6 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="rounded-lg border border-gray-400 px-3 py-3"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="role" className="text-sm font-semibold">I am a</label>
          <select
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="rounded-lg border border-gray-400 bg-white px-3 py-3"
          >
            <option value="member">Member</option>
            <option value="treasurer">Treasurer</option>
          </select>
        </div>

        {error && <p role="alert" className="text-sm text-red-700">{error}</p>}

        <button type="button" onClick={handleSignup} className="rounded-lg bg-blue-700 py-3 font-semibold text-white">Create account</button>
        <p className="text-center text-sm text-gray-600">or</p>
        <button type="button" onClick={handleGoogleSignUp} className="rounded-lg border-2 border-blue-700 py-3 font-semibold text-blue-700">Sign up with Google</button>

        <p className="text-center text-sm">
          Already have an account? <a href="#" className="font-semibold text-blue-700">Log in</a>
        </p>
      </div>
    </div>
  );
}

export default Signup;