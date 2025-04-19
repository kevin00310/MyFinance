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
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { styled } from "@mui/material/styles";
import icon from "../img/profile_icon.png";
import Converter from "./Converter.jsx";
import Profile from "./Profile";

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
  const [anchorEl, setAnchorEl] = useState(null); 

  const toggleModal = () => setIsModalOpen(!isModalOpen);
  const toggleConverter = () => setIsConverterOpen(!isConverterOpen);

  // Menu handlers
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleConverterClick = () => {
    handleMenuClose();
    toggleConverter();
  };

  const handleRewardClick = () => {
    handleMenuClose();
    navigate('/reward');
  };

  return (
    <>
      <StyledAppBar position="static" sx={{ boxShadow: 0 }}>
        <Toolbar>
          {/* Menu Icon for small screens */}
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={handleMenuOpen}
            sx={{ mr: 2, display: { xs: 'block', sm: 'none' } }} 
          >
            <MenuIcon />
          </IconButton>

          {/* MyFinance Title */}
          <Typography
            variant="h6"
            sx={{ flexGrow: 1 }}
            component={Link}
            to="/Home"
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            MyFinance
          </Typography>

          {/* Buttons for larger screens */}
          <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center', gap: 2 }}>
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

          {/* Avatar for small screens */}
          <Box sx={{ display: { xs: 'flex', sm: 'none' }, alignItems: 'center' }}>
            <Avatar
              src={icon}
              sx={{ width: 32, height: 32, cursor: 'pointer' }}
              onClick={toggleModal}
            />
          </Box>
        </Toolbar>
      </StyledAppBar>

      {/* Menu for small screens */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'bottom', // Attach to the bottom of the menu icon
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top', // Menu's top aligns with the anchor's bottom
          horizontal: 'left',
        }}
        sx={{ mt: 1 }} // Add margin-top to shift the menu down a bit
      >
        <MenuItem onClick={handleConverterClick}>Converter</MenuItem>
        <MenuItem onClick={handleRewardClick}>Reward</MenuItem>
      </Menu>

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