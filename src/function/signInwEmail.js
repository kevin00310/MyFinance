import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from '../firebase';

export async function signInwEmail(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    alert(`Sign-in successful! Welcome, ${user.email}`);
  } catch (error) {
    const errorCode = error.code;
    const errorMessage = error.message;
    alert("Email or Password not match.");
  }
}




