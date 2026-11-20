import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { auth, db } from "../firebase";

const AuthContext = createContext();


export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null); //role added
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    let stopWatchingRecord = null;

    const stopWatchingLogin = onAuthStateChanged(auth, (currentUser) => {
      if (stopWatchingRecord) {
        stopWatchingRecord();
        stopWatchingRecord = null;
      }

      setUser(currentUser);

      if (!currentUser) {
        setRole(null);
        setLoading(false);
        return;
      }

      //onSnapshot runs function now and again every time that record changes.
      stopWatchingRecord = onSnapshot(doc(db, "users", currentUser.uid), (snap) => {
        setRole(snap.exists() ? snap.data().role : null);
        setLoading(false);
      });
    });
   
    return () => {
      stopWatchingLogin();
      if (stopWatchingRecord) stopWatchingRecord();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, role, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}



