import { getFirestore } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCrs22Kw85Mv2fN8zKFoo5mMR_uYwNydGY",
  authDomain: "chamapay-13ddc.firebaseapp.com",
  projectId: "chamapay-13ddc",
  storageBucket: "chamapay-13ddc.firebasestorage.app",
  messagingSenderId: "478568036711",
  appId: "1:478568036711:web:d0bcf7e8dccb5116cd17c2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Authentication so your app can log people in
export const auth = getAuth(app);

// Set up Google Sign-in
export const googleProvider = new GoogleAuthProvider();

export const db = getFirestore(app);