import React from "react";
import { Modal, Box, Typography, TextField, Button, Alert } from "@mui/material";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 300,
  bgcolor: "background.paper",
  borderRadius: "8px",
  boxShadow: 24,
  p: 4,
};

function ResetPasswordModal({ open, handleClose, email, setEmail, handleResetPassword, message, severity }) {
  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={modalStyle}>
        <Typography variant="h6" mb={2}>
          Reset Password
        </Typography>
        <TextField
          fullWidth
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          margin="normal"
        />
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end", // Align button to the right
            mt: 2,
          }}
        >
          <Button
            variant="contained"
            color="primary"
            onClick={handleResetPassword}
          >
            Reset
          </Button>
        </Box>

        {/* Feedback Message */}
        {message && (
          <Alert severity={severity} sx={{ mt: 2 }}>
            {message}
          </Alert>
        )}
      </Box>
    </Modal>
  );
}

export default ResetPasswordModal;
