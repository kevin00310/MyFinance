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
    console.log(name)
    await createUser(user, name);

    alert(`Welcome, ${user.email}`);
    //alert(`Sign-up successful! Welcome, ${user.email}`);
    window.location.href = "/home";
    
  } catch (error) {
    const errorCode = error.code;
    console.log(errorCode);
    const errorMessage = error.message;
    console.log(errorMessage);
    // alert(`Error ${errorCode}: ${errorMessage}`);
    alert("Email already in use, please try another.");
  }
}

