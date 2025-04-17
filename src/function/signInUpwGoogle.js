import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { providerGoogle } from "../firebase";
import { createUser } from "../function/createUser";

export const signInUpwGoogle = async () => {
  const auth = getAuth();

  try {
    // Set custom parameters to force account selection
    providerGoogle.setCustomParameters({ prompt: "select_account" });

    console.log("Attempting Google sign-in...");

    // Use popup flow for all devices
    const result = await signInWithPopup(auth, providerGoogle);

    // Process user information
    const user = result.user;
    const email = user.email || "Email";
    console.log(email);
    const displayName = user.displayName || "User";

    console.log(`Signed in as: ${displayName}`);

    await createUser(user, displayName);

    alert(`Welcome, ${email}`);

    // Redirect to /home after alert
    window.location.href = "/home";
  } catch (error) {
    console.error("Error during Google sign-in:", error);

    // Handle specific errors
    switch (error.code) {
      case "auth/popup-closed-by-user":
        alert("Popup closed before completing sign-in. Please try again.");
        break;
      case "auth/account-exists-with-different-credential":
        alert(
          "An account with this email already exists. Please use a different sign-in method."
        );
        break;
      default:
        alert("Failed to sign in with Google. Please try again.");
    }
  }
};