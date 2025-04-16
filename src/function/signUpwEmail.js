// import React, { useState } from "react";
// import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { createUser } from "../function/createUser";
// import emailjs from '@emailjs/browser';

export async function signUpwEmail(email, password, name) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log("User UID:", user.uid);
    await createUser(user, name);

    // // Send email using emailjs
    // const emailParams = {
    //   to_email: email,
    //   to_name: name,
    //   message: `Hi ${name}, welcome to MyFinance! Your sign-up was successful. Enjoy your journey here!!`
    // };

    // emailjs.send(
    //   'service_mb3fmk5', 
    //   'template_3ivz7qi', 
    //   emailParams,
    //   '1WDN9ycI63BfAOVJ6'
    // ).then(() => {
    //   console.log('Sign-up email sent successfully.');
    // }).catch((err) => {
    //   console.error('Failed to send sign-up email:', err);
    // });

    // alert(`Sign-up successful! Welcome, ${user.email}`);
    
  } catch (error) {
    const errorCode = error.code;
    const errorMessage = error.message;
    alert(`Error ${errorCode}: ${errorMessage}`);
  }
}

