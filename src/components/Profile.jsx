import React from 'react';
import { Link } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase'; // Adjust the import path as needed
import { Paper, Typography, Divider, Button, Box } from '@mui/material';
import { styled } from '@mui/material/styles';

const ProfileModal = styled(Paper)(({ theme }) => ({
  position: 'absolute',
  width: 300,
  padding: theme.spacing(3),
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  borderRadius: 8,
}));

const Profile = ({ user, uid, daysJoined, userName, onClose, navigate }) => {
  const logoutFunc = () => {
    try {
      alert('Logout Successful!');
      signOut(auth)
        .then(() => {
          console.log('Logout successful!');
          navigate('/');
        })
        .catch((error) => {
          alert('Error during logout: ' + error.message);
        });
    } catch (error) {
      alert('Unexpected error: ' + error.message);
    }
  };

  return (
    <ProfileModal>
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
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button
          variant="contained"
          component={Link}
          to="/reward"
          sx={{ backgroundColor: '#3b82f6', '&:hover': { backgroundColor: '#2563eb' } }}
        >
          Reward
        </Button>
        <Button
          variant="contained"
          onClick={logoutFunc}
          sx={{ backgroundColor: '#3b82f6', '&:hover': { backgroundColor: '#2563eb' } }}
        >
          Logout
        </Button>
      </Box>
    </ProfileModal>
  );
};

export default Profile;