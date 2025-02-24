import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from '../firebase';
import { providerGoogle } from "../firebase";



export const signInWithGoogle = async () => {
    const auth = getAuth();
    try {
      const result = await signInWithPopup(auth, providerGoogle);
      const user = result.user;
      await createUserDocument(user);
      alert("User Authenticated Successfully!");
      navigate("/dashboard");
    } catch (error) {
      console.error("Error signing in with Google: ", error.message);
    }
  };