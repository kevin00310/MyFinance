import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { sendPasswordResetEmail } from "firebase/auth";
import { useUserAuth } from "../function/useUserAuth.js";
import { signInwEmail } from "../function/signInwEmail.js";
import {
  signInUpwGoogle,
  handleRedirectResult,
} from "../function/signInUpwGoogle.js";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Divider,
  Link,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import HeaderSignIn from "../components/HeaderSignIn";

// entire page background is consistent
const PageWrapper = styled(Box)({
  minHeight: "100vh",
  width: "100%",
  backgroundColor: "#f5f5f5",
  margin: 0,
  padding: 0,
  display: "flex",
  flexDirection: "column",
});

// form style
const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: 12,
  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  padding: theme.spacing(1),
  width: "100%",
  maxWidth: 400,
  textAlign: "center",
}));

// login btn style
const LoginButton = styled(Button)(({ theme }) => ({
  width: 200,
  padding: theme.spacing(1.25, 0),
  backgroundColor: "#10b981",
  "&:hover": {
    backgroundColor: "#059669",
  },
  textTransform: "none",
}));

// google btn style
const GoogleButton = styled(Button)(({ theme }) => ({
  width: "48%",
  padding: theme.spacing(1, 0),
  backgroundColor: "#3b82f6",
  color: "white",
  "&:hover": {
    backgroundColor: "#2563eb",
  },
  textTransform: "none",
}));

function LogIn() {
  useUserAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Log In';
  }, []);

  const theme = useTheme();
  const isXsScreen = useMediaQuery(theme.breakpoints.down("sm")); // < 600px
  const isSmScreen = useMediaQuery(theme.breakpoints.between("sm", "md")); // 600px - 899px
  const isMdScreen = useMediaQuery(theme.breakpoints.up("md")); // >= 900px

  // adjust top padding based on screen size
  const getDynamicPaddingTop = () => {
    if (isXsScreen) return 2; // 32px
    if (isSmScreen) return 4; // 48px 
    if (isMdScreen) return 6; // 64px 
    return 8; 
  };

  const dynamicPt = getDynamicPaddingTop();

  // sign in func
  const handleSignInClick = (event) => {
    event.preventDefault();
    if (email && password) {
      signInwEmail(email, password);
    } else {
      alert("Email or Password not match.");
    }
  };

  // google sign in func
  const SignInGoogle = () => {
    signInUpwGoogle(navigate, "/home").catch((error) => {
      console.error("Error during Google sign-in:", error);
      alert("Failed to sign in with Google. Please try again.");
    });
  };

  useEffect(() => {
    handleRedirectResult(navigate)
      .catch((error) => {
        console.error("Error during Google redirect handling:", error);
        alert("Error during Google sign-in. Please try again.");
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  // reset password
  const handlePasswordReset = async () => {
    const email = window.prompt("Please enter your email for reset password:");
    if (!email) {
      alert("Email is required to reset the password.");
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      alert("Password reset email sent successfully. Please check your inbox.");
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  // loading
  if (loading) {
    return (
      <PageWrapper>
        <HeaderSignIn />
        <Box
          sx={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          Loading...
        </Box>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <HeaderSignIn />
      <Box
        sx={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          pt: dynamicPt, 
        }}
      >
        <Container sx={{ display: "flex", justifyContent: "center" }}>
          <StyledCard>
            <CardContent>
              <Typography variant="h5" align="center" gutterBottom>
                Log in to{" "}
                <Box component="span" color="#3b82f6">
                  MyFinance
                </Box>
              </Typography>
              <Box component="form" sx={{ textAlign: "center" }}>
                <TextField
                  fullWidth
                  label="Email"
                  variant="standard"
                  margin="normal"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  sx={{ mb: 0, maxWidth: "90%", mx: "auto" }}
                />
                <TextField
                  fullWidth
                  label="Password"
                  type="password"
                  variant="standard"
                  margin="normal"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  sx={{ mb: 2, maxWidth: "90%", mx: "auto" }}
                />
                <LoginButton
                  variant="contained"
                  onClick={handleSignInClick}
                  sx={{ mt: 2, mb: 2 }}
                >
                  Log In
                </LoginButton>
              </Box>
              <Box sx={{ my: 1 }}>
                <Divider>or</Divider>
              </Box>
              <Box sx={{ mb: 2 }}>
                <GoogleButton variant="contained" onClick={SignInGoogle}>
                  Sign In with Google
                </GoogleButton>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Forgot Password?{" "}
                <Link
                  component="button"
                  onClick={handlePasswordReset}
                  sx={{ color: "#3b82f6" }}
                >
                  Click Here
                </Link>
              </Typography>
            </CardContent>
          </StyledCard>
        </Container>
      </Box>
    </PageWrapper>
  );
}

export default LogIn;