import { db } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { sendEmail } from '../function/sendEmail'; 

export const createUser = async (user, name) => {
  console.log(user.email, user.displayName, name);
  if (!user) return;
  
  const userRef = doc(db, "users", user.uid);
  const userData = await getDoc(userRef);
  
  console.log(userData);

  if (!userData.exists()) {
    console.log(user, name);
    try {
      await setDoc(userRef, {
        name: user.displayName || name, 
        email: user.email,
        photoURL: user.photoURL || "",
        joinDate: new Date(),
      });

      console.log("user email: " + user.email);
      console.log("user name: " + name);

      await sendEmail(user.email, name);

      alert(`Sign up successful! Welcome, ${user.email}`);
      // alert("User added");
    } catch (e) {
      alert(e.message);
    }
  } else {
    console.log("User data exists:", userData.data());
    // alert("User already exist");
  }

};