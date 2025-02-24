import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./SignUp.css";
import { useUserAuth } from "../function/useUserAuth.js";
import { signUpwEmail } from "../function/signUpwEmail.js";
import { signUpwGoogle, handleRedirectResult } from "../function/signUpwGoogle.js";

function SignUp() {
  useUserAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [comPassword, setComPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Handle the result of the redirect flow
    handleRedirectResult(navigate);
  }, [navigate]);

  const handleSignUpClick = (event) => {
    event.preventDefault();
    if (name && email && password && comPassword) {
      if (password === comPassword) {
        signUpwEmail(email, password, name);
        navigate("/home");
      } else {
        alert("Error: Passwords do not match.");
      }
    } else {
      alert("Error: All fields are required.");
    }
  };

  const SignUpGoogle = () => {
    signUpwGoogle(navigate);
  };

  return (
    <div>
      <div className="header">MyFinance</div>
      <div className="signupContainer">
        <div className="signupCard">
          <h2 className="signupHeader">
            Sign up to <span className="highlight">MyFinance</span>
          </h2>
          <form className="signupForm">
            <div className="formGrp">
              <label htmlFor="fullName">Full Name</label>
              <input
                type="text"
                id="fullName"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
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
            <div className="formGrp">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                placeholder="Confirm your password"
                value={comPassword}
                onChange={(e) => setComPassword(e.target.value)}
              />
            </div>
            <button className="signupBtn" onClick={handleSignUpClick}>
              Sign Up
            </button>
          </form>
          <div className="socialBtn">
            <p>or</p>
            <button className="googleBtn" onClick={SignUpGoogle}>
              Sign Up with Google
            </button>
          </div>
          <p className="footer-text">
            Already Have Account? <Link to="/login">Click Here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
