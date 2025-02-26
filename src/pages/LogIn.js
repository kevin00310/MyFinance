import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import './LogIn.css'; 
import { auth } from "../firebase";
import { sendPasswordResetEmail } from "firebase/auth";
import { useUserAuth } from "../function/useUserAuth.js";
import { signInwEmail } from "../function/signInwEmail.js";
import {
  signInUpwGoogle,
  handleRedirectResult,
} from "../function/signInUpwGoogle.js";

function LogIn() {

  useUserAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const handleSignInClick = (event) => {
    event.preventDefault();
    if (email && password) {
      signInwEmail(email, password);
    } else {
      alert("Email or Password not match.");
    }
  };

  const SignInGoogle = () => {
    signInUpwGoogle(navigate).catch((error) => {
      console.error("Error during Google sign-up:", error);
      alert("Failed to sign up with Google. Please try again.");
    });
  };

  useEffect(() => {
    // Handle redirect results for Google Sign-In
    handleRedirectResult(navigate)
      .catch((error) => {
        console.error("Error during Google redirect handling:", error);
        alert("Error during Google sign-in. Please try again.");
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  const handlePasswordReset = async () => {
    // Show a prompt window for the user to enter their email
    const email = window.prompt("Please enter your email for reset password:");

    if (!email) {
      alert("Email is required to reset the password.");
      return;
    }

    try {
      // Trigger the Firebase password reset email
      await sendPasswordResetEmail(auth, email);
      alert("Password reset email sent successfully. Please check your inbox.");
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <div>
      <div className="header">MyFinance</div>
      <div className="loginContainer">
        <div className="loginCard">
          <h2 className="loginHeader">
            Log in to <span className="highlight">MyFinance</span>
          </h2>
          <form className="loginForm">
            <div className="formGrp">
              <label htmlFor="email">Email</label>
              <input 
                type="email" 
                id="email" 
                placeholder="Enter your email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="formGrp">
              <label htmlFor="password">Password</label>
              <input 
                type="password" 
                id="password" 
                placeholder="Enter your password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button className="loginBtn" onClick={handleSignInClick}>
              Log In
            </button>
          </form>
          <div className="socialBtn">
            <p>or</p>
            <button className="googleBtn" onClick={SignInGoogle}>Sign In with Google</button>
            {/* <button className="appleBtn">Sign Up with Apple</button> */}
          </div>
          <p className="footer-text">
            Forget Password? <a onClick={handlePasswordReset}>Click Here</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LogIn;