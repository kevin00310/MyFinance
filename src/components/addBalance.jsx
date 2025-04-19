import React from 'react';
import {
  Box,
  Button,
  Modal,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import getFlagIcon from '../utils/getFlagIcon';

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

const AddBalance = ({
  open,
  onClose,
  currencies,
  selectedCurrency,
  setSelectedCurrency,
  selectedBalanceAmount,
  setSelectedBalanceAmount,
  addBalance,
}) => {
  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={modalStyle}>
        <IconButton sx={{ position: "absolute", top: 8, right: 8 }} onClick={onClose}>
          <CloseIcon />
        </IconButton>
        <Typography variant="h6" align="center">Add Balance</Typography>
        <TextField
          label="Amount"
          type="number"
          fullWidth
          margin="normal"
          value={selectedBalanceAmount}
          onChange={(e) => setSelectedBalanceAmount(e.target.value)}
          required
        />
        <FormControl fullWidth margin="normal">
          <InputLabel>Currency</InputLabel>
          <Select value={selectedCurrency} onChange={(e) => setSelectedCurrency(e.target.value)} required>
            <MenuItem value="">-- Select Currency --</MenuItem>
            <MenuItem value="MYR">
              <span style={{ display: 'flex', alignItems: 'center' }}>
                {getFlagIcon('MYR')} <span style={{ marginLeft: '8px' }}>MYR</span>
              </span>
            </MenuItem>
            {currencies.sort().map((currency) => (
              <MenuItem key={currency} value={currency}>
                <span style={{ display: 'flex', alignItems: 'center' }}>
                  {getFlagIcon(currency)} <span style={{ marginLeft: '8px' }}>{currency}</span>
                </span>
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button variant="contained" color="primary" fullWidth onClick={addBalance} sx={{ mt: 2 }}>Add Balance</Button>
      </Box>
    </Modal>
  );
};

export default AddBalance;