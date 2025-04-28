import React, { useEffect, useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { sendPasswordResetEmail } from "firebase/auth";
import { useUserAuth } from "../function/useUserAuth.js";
import { signInwEmail } from "../function/signInwEmail.js";
import { signInUpwGoogle } from "../function/signInUpwGoogle.js";
import {
  Modal,
  Snackbar,
  Alert,
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
import ResetPasswordModal from "../components/resetPassword";

const PageWrapper = styled(Box)({
  minHeight: "100vh",
  width: "100%",
  backgroundColor: "#f5f5f5",
  margin: 0,
  padding: 0,
  display: "flex",
  flexDirection: "column",
});

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: 12,
  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  padding: theme.spacing(1),
  width: "100%",
  maxWidth: 400,
  textAlign: "center",
}));

const LoginButton = styled(Button)(({ theme }) => ({
  width: 200,
  padding: theme.spacing(1.25, 0),
  backgroundColor: "#10b981",
  "&:hover": {
    backgroundColor: "#059669",
  },
  textTransform: "none",
}));

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
  const [notification, setNotification] = useState({ open: false, message: "", severity: "info" });
  const [open, setOpen] = useState(false);

  const navigate = useNavigate();

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setEmail("");
    setNotification({ open: false, message: "", severity: "info" });
    setOpen(false);
  };

  const showNotification = (message, severity) => {
    setNotification({ open: true, message, severity });
  };

  const handleSignInClick = (event) => {
    event.preventDefault();
    if (email && password) {
      signInwEmail(email, password).catch((error) =>
        showNotification("Email or Password not match.", "error")
      );
    } else {
      showNotification("Please enter both email and password.", "warning");
    }
  };

  const SignInGoogle = () => {
    signInUpwGoogle(navigate, "/home").catch((error) => {
      console.error("Error during Google sign-in:", error);
      showNotification("Failed to sign in with Google. Please try again.", "error");
    });
  };

  const handleResetPassword = async () => {
    try {
      await sendPasswordResetEmail(auth, email);
      showNotification("Password reset email sent! Check your inbox.", "success");
    } catch (error) {
      showNotification(`Error: ${error.message}`, "error");
    }
  };

  return (
    <PageWrapper>
      <HeaderSignIn />
      <Box
        sx={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          pt: 8,
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
                <Typography variant="body2" color="text.secondary">
                  Forgot Password?{" "}
                  <Link
                    component="button"
                    onClick={(event) => {
                      event.preventDefault();
                      handleOpen();
                    }}
                    sx={{ color: "#3b82f6" }}
                  >
                    Click Here
                  </Link>
                </Typography>
              </Box>
              <Box sx={{ my: 1 }}>
                <Divider>or</Divider>
              </Box>
              <Box sx={{ mb: 2 }}>
                <GoogleButton variant="contained" onClick={SignInGoogle}>
                  Sign In with Google
                </GoogleButton>
              </Box>
              <Typography variant="body2" color="text.secondary" align="center">
                Don't Have Account?{" "}
                <Link component={RouterLink} to="/" style={{ color: "#3b82f6" }}>
                  Sign up now
                </Link>
              </Typography>
            </CardContent>
          </StyledCard>
        </Container>
      </Box>
      <ResetPasswordModal
        open={open}
        handleClose={handleClose}
        email={email}
        setEmail={setEmail}
        handleResetPassword={handleResetPassword}
        message={notification.message}
        severity={notification.severity}
      />
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={() => setNotification({ ...notification, open: false })}
      >
        <Alert
          onClose={() => setNotification({ ...notification, open: false })}
          severity={notification.severity}
          sx={{ width: "100%" }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </PageWrapper>
  );
}

export default LogIn;
