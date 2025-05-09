import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUserAuth } from "../function/useUserAuth.js";
import { signUpwEmail } from "../function/signUpwEmail.js";
import { signInUpwGoogle } from "../function/signInUpwGoogle.js";
import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Divider,
  Snackbar,
  Alert,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import HeaderSignIn from "../components/HeaderSignIn";

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

const StyledButton = styled(Button)(({ theme }) => ({
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

function SignUp() {
  useUserAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [comPassword, setComPassword] = useState("");
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Sign Up";
  }, []);

  const theme = useTheme();
  const isXsScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const isSmScreen = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const isMdScreen = useMediaQuery(theme.breakpoints.up("md"));

  const getDynamicPaddingTop = () => {
    if (isXsScreen) return 6;
    if (isSmScreen) return 8;
    if (isMdScreen) return 8;
    return 8;
  };

  const dynamicPt = getDynamicPaddingTop();

  const handleSnackbarClose = () => setSnackbar({ ...snackbar, open: false });

  const handleSignUpClick = (event) => {
    event.preventDefault();
    if (name && email && password && comPassword) {
      if (password === comPassword) {
        if (password.length >= 8) {
          signUpwEmail(email, password, name)
            .then(() => navigate("/home"))
            .catch((error) => {
              // console.error("Error during email sign-up:", error);
              setSnackbar({ open: true, message: "Failed to sign up. Please check your details and try again.", severity: "error" });
            });
        } else {
          setSnackbar({ open: true, message: "Password must be at least 8 characters long.", severity: "warning" });
        }
      } else {
        setSnackbar({ open: true, message: "Passwords do not match.", severity: "warning" });
      }
    } else {
      setSnackbar({ open: true, message: "All fields are required.", severity: "warning" });
    }
  };

  const SignUpGoogle = () => {
    signInUpwGoogle().catch((error) => {
      // console.error("Error during Google sign-up:", error);
      setSnackbar({ open: true, message: "Failed to sign up with Google. Please try again.", severity: "error" });
    });
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
          pt: dynamicPt,
        }}
      >
        <Container sx={{ display: "flex", justifyContent: "center" }}>
          <StyledCard>
            <CardContent>
              <Typography variant="h5" align="center" gutterBottom>
                Sign up to{" "}
                <Box component="span" color="#3b82f6">
                  MyFinance
                </Box>
              </Typography>
              <Box component="form" sx={{ textAlign: "center" }}>
                <TextField
                  fullWidth
                  label="Username"
                  placeholder="Enter your username"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  margin="normal"
                  variant="standard"
                  sx={{ mb: 0, maxWidth: "90%", mx: "auto" }}
                />
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  margin="normal"
                  variant="standard"
                  sx={{ mb: 0, maxWidth: "90%", mx: "auto" }}
                />
                <TextField
                  fullWidth
                  label="Password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  margin="normal"
                  variant="standard"
                  sx={{ mb: 0, maxWidth: "90%", mx: "auto" }}
                />
                <TextField
                  fullWidth
                  label="Confirm Password"
                  type="password"
                  placeholder="Confirm your password"
                  value={comPassword}
                  onChange={(e) => setComPassword(e.target.value)}
                  margin="normal"
                  variant="standard"
                  sx={{ mb: 2, maxWidth: "90%", mx: "auto" }}
                />
                <StyledButton
                  variant="contained"
                  onClick={handleSignUpClick}
                  sx={{ mt: 2, mb: 2 }}
                >
                  Sign Up
                </StyledButton>
              </Box>
              <Box sx={{ my: 1 }}>
                <Divider>or</Divider>
              </Box>
              <Box sx={{ mb: 2 }}>
                <GoogleButton variant="contained" onClick={SignUpGoogle}>
                  Sign Up with Google
                </GoogleButton>
              </Box>
              <Typography variant="body2" color="text.secondary" align="center">
                Already Have Account?{" "}
                <Link to="/login" style={{ color: "#3b82f6" }}>
                  Click Here
                </Link>
              </Typography>
            </CardContent>
          </StyledCard>
        </Container>
      </Box>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </PageWrapper>
  );
}

export default SignUp;
