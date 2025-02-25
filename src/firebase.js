import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// google apple login
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAhoBYL0TVW6WYbL1wpZ3NjcJ9fK0lK1zI",
  authDomain: "myfinance-0310.firebaseapp.com",
  projectId: "myfinance-0310",
  storageBucket: "myfinance-0310.firebasestorage.app",
  messagingSenderId: "628319147240",
  appId: "1:628319147240:web:40ca5210347eb982dea55d",
  measurementId: "G-7NCJPPR02B"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);
const providerGoogle = new GoogleAuthProvider();

export { db, auth, providerGoogle, doc, setDoc };