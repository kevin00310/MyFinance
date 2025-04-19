import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Modal,
  Button,
  Avatar,
} from '@mui/material';
import { styled } from "@mui/material/styles";
import icon from "../img/profile_icon.png";
import Converter from "./Converter.jsx";
import Profile  from "./Profile";

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: '#3b82f6',
}));

const Header = ({
  user,
  uid,
  navigate,
  daysJoined,
  userName,
  isModalOpen,
  setIsModalOpen,
}) => {
  const [isConverterOpen, setIsConverterOpen] = useState(false);

  const toggleModal = () => setIsModalOpen(!isModalOpen);
  const toggleConverter = () => setIsConverterOpen(!isConverterOpen);

  return (
    <>
      <StyledAppBar position="static" sx={{ boxShadow: 0 }}>
        <Toolbar>
          <Typography
            variant="h6"
            sx={{ flexGrow: 1 }}
            component={Link}
            to="/Home"
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            MyFinance
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Button color="inherit" onClick={toggleConverter}>
              Converter
            </Button>
            <Button color="inherit" component={Link} to="/reward">
              Reward
            </Button>
            <Avatar
              src={icon}
              sx={{ width: 32, height: 32, cursor: 'pointer' }}
              onClick={toggleModal}
            />
          </Box>
        </Toolbar>
      </StyledAppBar>

      {/* Profile Modal */}
      <Modal open={isModalOpen} onClose={toggleModal}>
        <div>
          <Profile
            user={user}
            uid={uid}
            daysJoined={daysJoined}
            userName={userName}
            onClose={toggleModal}
            navigate={navigate}
          />
        </div>
      </Modal>

      {/* Converter Popup */}
      <Converter open={isConverterOpen} onClose={toggleConverter} />
    </>
  );
};

export default Header;