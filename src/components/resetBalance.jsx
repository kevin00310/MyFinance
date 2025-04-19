import React from 'react';
import {
  Box,
  Button,
  Modal,
  Typography,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 350,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 3,
  borderRadius: 2,
};

const ResetBalance = ({
  open,
  onClose,
  resetTransactions,
}) => {
  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={modalStyle}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
          <Typography variant="h6">Confirm Reset</Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Typography variant="body1" sx={{ mb: 3 }}>
          Do you want to clear all transaction data?
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Button
            variant="contained"
            color="primary"
            onClick={resetTransactions}
            sx={{ flex: 1, mr: 1 }}
          >
            Yes
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={onClose}
            sx={{ flex: 1, ml: 1 }}
          >
            No
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default ResetBalance;