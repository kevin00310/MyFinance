import {
  getAuth,
  signInWithPopup,
  getRedirectResult,
  GoogleAuthProvider,
} from "firebase/auth";
import { providerGoogle } from "../firebase";
import { createUser } from "./createUser";

export const signInUpwGoogle = async (navigate, redirectTo = "/home") => {
  const auth = getAuth();

  try {
    // Set custom parameters to force account selection
    providerGoogle.setCustomParameters({ prompt: "select_account" });

    console.log("Attempting Google sign-in...");

    // Use popup flow for all devices
    const result = await signInWithPopup(auth, providerGoogle);

    // Process user information
    const user = result.user;
    const email =  user.email || "Email";
    console.log(email);
    const displayName = user.displayName || "User";

    console.log(`Signed in as: ${displayName}`);

    // Check if a new user needs to be created
    if (result.additionalUserInfo?.isNewUser) {
      await createUser(user, displayName); // Create user in database
    }

    // Navigate to the intended route
    navigate(redirectTo);
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

    // Explicitly prevent navigation if error occurs
    return;
  }
};

export const handleRedirectResult = (navigate) => {
  const auth = getAuth();
  return getRedirectResult(auth).then((result) => {
    if (result) {
      // Process the result, e.g., navigate to the home page
      navigate("/home");
    }
  }).catch((error) => {
    console.error("Error handling redirect result:", error);
  });
};