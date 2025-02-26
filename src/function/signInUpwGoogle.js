import {
  getAuth,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  GoogleAuthProvider,
} from "firebase/auth";
import { providerGoogle } from "../firebase";
import { createUser } from "./createUser";

export const signInUpwGoogle = async (navigate) => {
  const auth = getAuth();
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  try {
    // Set custom parameters to force account selection
    providerGoogle.setCustomParameters({ prompt: "select_account" });

    if (isMobile) {
      // Use redirect flow for mobile devices
      await signInWithRedirect(auth, providerGoogle);
    } else {
      // Use popup flow for desktop
      const result = await signInWithPopup(auth, providerGoogle);

      // Process user information
      const user = result.user;
      const displayName = user.displayName || "User";

      console.log(`Signed in as: ${displayName}`);

      // Check if a new user needs to be created
      if (result.additionalUserInfo.isNewUser) {
        await createUser(user, displayName); // Create user in database
      }

      navigate("/home"); // Navigate to home page
    }
  } catch (error) {
    console.error("Error during Google sign-in/sign-up:", error);
    if (error.code === "auth/account-exists-with-different-credential") {
      alert(
        "An account with this email already exists. Please use a different sign-in method."
      );
    }
  }
};

export const handleRedirectResult = async (navigate) => {
  const auth = getAuth();
  try {
    const result = await getRedirectResult(auth);
    if (result) {
      const user = result.user;
      const displayName = user.displayName || "User";

      console.log(`Redirect sign-in successful: ${displayName}`);
      if (result.additionalUserInfo.isNewUser) {
        await createUser(user, displayName); // Create user if new
      }

      navigate("/home"); // Navigate to home page
    }
  } catch (error) {
    console.error("Error handling redirect result:", error);
  }
};
