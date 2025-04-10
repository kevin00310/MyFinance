import React from "react";
import { auth } from "../firebase";
import { Link } from "react-router-dom";
import { signOut } from "firebase/auth";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Modal,
  Button,
  Avatar,
  Paper,
  Divider,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import icon from "../img/profile_icon.png";

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: "#3b82f6",
}));

const ProfileModal = styled(Paper)(({ theme }) => ({
  position: "absolute",
  width: 300,
  padding: theme.spacing(3),
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  borderRadius: 8,
}));

const Header = ({
  user,
  uid, // Receive uid as a prop
  navigate,
  daysJoined,
  userName,
  isModalOpen,
  setIsModalOpen,
}) => {
  const logoutFunc = () => {
    try {
      alert("Logout Successful!");
      signOut(auth)
        .then(() => {
          console.log("Logout successful!");
          navigate("/");
        })
        .catch((error) => {
          alert("Error during logout: " + error.message);
        });
    } catch (error) {
      alert("Unexpected error: " + error.message);
    }
  };

  const toggleModal = () => setIsModalOpen(!isModalOpen);

  return (
    <>
      <StyledAppBar position="static" sx={{ boxShadow: 0 }} >
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }} component={Link}
            to="/Home" style={{ textDecoration: "none", color: "inherit" }} >
            MyFinance
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Button color="inherit" component={Link} to="/reward">
              Reward
            </Button>
            <Avatar
              src={icon}
              sx={{ width: 32, height: 32, cursor: "pointer" }}
              onClick={toggleModal}
            />
          </Box>
        </Toolbar>
      </StyledAppBar>

      <Modal open={isModalOpen} onClose={toggleModal}>
        <ProfileModal>
          <Typography variant="body1" sx={{ mb: 1 }}>
            <strong>UID:</strong> {uid} {/* Display uid */}
          </Typography>
          <Typography variant="body1" sx={{ mb: 1 }}>
            <strong>Day Joined:</strong> {daysJoined} Days
          </Typography>
          <Typography variant="body1" sx={{ mb: 1 }}>
            <strong>Name:</strong> {userName}
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            <strong>Email:</strong> {user?.email}
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Button
              variant="contained"
              component={Link}
              to="/reward"
              sx={{ backgroundColor: "#3b82f6", "&:hover": { backgroundColor: "#2563eb" } }}
            >
              Reward
            </Button>
            <Button
              variant="contained"
              onClick={logoutFunc}
              sx={{ backgroundColor: "#3b82f6", "&:hover": { backgroundColor: "#2563eb" } }}
            >
              Logout
            </Button>
          </Box>
        </ProfileModal>
      </Modal>
    </>
  );
};

export default Header;