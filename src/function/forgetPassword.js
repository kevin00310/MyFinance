import React from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebase"; // Replace db with auth since sendPasswordResetEmail works with auth

export function ForgetPassword() {
  const handlePasswordReset = async () => {
    // show prompt window for user to enter email
    const email = window.prompt("Please enter your email address for password reset:");

    if (!email) {
      alert("Email is required to reset the password.");
      return;
    }

    try {
      // trigger Firebase password reset email
      await sendPasswordResetEmail(auth, email);
      alert("Password reset email sent successfully. Please check your inbox.");
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <div className="ResetPasswordDiv">
      <h2>Forget Password</h2>
      <button onClick={handlePasswordReset}>Send Password Reset Email</button>
    </div>
  );
}
