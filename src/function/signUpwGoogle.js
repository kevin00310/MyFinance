import {
  getAuth,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  GoogleAuthProvider,
  signOut,
} from "firebase/auth";
import { providerGoogle } from "../firebase";
import { createUser } from "../function/createUser";
import emailjs from "@emailjs/browser";

export const signUpwGoogle = async (navigate) => {
  const auth = getAuth();
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  try {
    // Sign out any logged-in user to ensure a clean state
    await signOut(auth);

    // Set custom parameters to force account selection
    providerGoogle.setCustomParameters({ prompt: "select_account" });

    if (isMobile) {
      // Use redirect flow for mobile devices
      await signInWithRedirect(auth, providerGoogle);
    } else {
      // Use popup flow for desktop
      const result = await signInWithPopup(auth, providerGoogle);

      // Process user information from popup result
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const user = result.user;
      const displayName = user.displayName || "User";

      console.log(`Signed in as: ${displayName}`);
      await createUser(user, displayName);

      // Send a welcome email using EmailJS
      const emailParams = {
        to_email: user.email,
        to_name: displayName,
        message: `Hi ${displayName}, welcome to MyFinance! Your sign-up was successful. Enjoy your journey here!`,
      };

      await emailjs.send(
        "service_mb3fmk5",
        "template_3ivz7qi",
        emailParams,
        "1WDN9ycI63BfAOVJ6"
      );

      console.log("Welcome email sent successfully.");
      navigate("/home");
    }
  } catch (error) {
    console.error("Error during Google sign-up:", error);
    if (error.code === "auth/account-exists-with-different-credential") {
      alert(
        "An account with this email already exists. Please use a different sign-in method."
      );
    }
  }
};

// Handle redirect results (to be used in App.js or SignUp.js)
export const handleRedirectResult = async (navigate) => {
  const auth = getAuth();
  try {
    const result = await getRedirectResult(auth);
    if (result) {
      const user = result.user;
      const displayName = user.displayName || "User";

      console.log(`Redirect sign-in successful: ${displayName}`);
      await createUser(user, displayName);

      navigate("/home"); // Redirect to /home after successful login
    }
  } catch (error) {
    console.error("Error handling redirect result:", error);
  }
};

