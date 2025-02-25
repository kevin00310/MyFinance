import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from '../firebase';

export async function signInwEmail(email, password) {
  try {
    // const auth = getAuth();
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    alert(`Sign-ip successful! Welcome, ${user.email}`);
    // Additional logic after successful sign-ip can be added here
  } catch (error) {
    const errorCode = error.code;
    const errorMessage = error.message;
    alert("Email or Password not match.");
  }
}




