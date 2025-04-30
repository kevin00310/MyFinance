import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { createUser } from "../function/createUser";

export async function signUpwEmail(email, password, name) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log("User UID:", user.uid);
    console.log(name)
    await createUser(user, name);

    alert(`Welcome, ${user.email}`);
    window.location.href = "/home";
    
  } catch (error) {
    const errorCode = error.code;
    console.log(errorCode);
    const errorMessage = error.message;
    console.log(errorMessage);
    alert("Invalid email, please try another.");
  }
}

