import { db } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import emailjs from '@emailjs/browser';


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
      // Send email using emailjs
    const emailParams = {
      to_email: user.email,
      to_name: user.name,
      message: `Hi ${user.name}, welcome to MyFinance! Your sign-up was successful. Enjoy your journey here!!`
    };

    emailjs.send(
      'service_mb3fmk5', 
      'template_3ivz7qi', 
      emailParams,
      '1WDN9ycI63BfAOVJ6'
    ).then(() => {
      console.log('Sign-up email sent successfully.');
    }).catch((err) => {
      console.error('Failed to send sign-up email:', err);
    });

    alert(`Sign-up successful! Welcome, ${user.email}`);
      // alert("User added");
    } catch (e) {
      alert(e.message);
    }
  } else {
    console.log("User data exists:", userData.data());
    // alert("User already exist");
  }

};