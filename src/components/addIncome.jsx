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
import moment from "moment";
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

const AddIncome = ({
  open,
  onClose,
  currencies,
  selectedCurrency,
  setSelectedCurrency,
  selectedIncomeAmount,
  setSelectedIncomeAmount,
  selectedIncomeName,
  setSelectedIncomeName,
  selectedIncomeType,
  setSelectedIncomeType,
  selectedIncomeDate,
  setSelectedIncomeDate,
  addIncome,
}) => {
  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={modalStyle}>
        <IconButton sx={{ position: "absolute", top: 8, right: 8 }} onClick={onClose}>
          <CloseIcon />
        </IconButton>
        <Typography variant="h6" align="center">Add Income</Typography>
        <TextField
          label="Amount"
          type="number"
          fullWidth
          margin="normal"
          value={selectedIncomeAmount}
          onChange={(e) => setSelectedIncomeAmount(e.target.value)}
          required
        />
        <TextField
          label="Name"
          fullWidth
          margin="normal"
          value={selectedIncomeName}
          onChange={(e) => setSelectedIncomeName(e.target.value)}
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
        <FormControl fullWidth margin="normal">
          <InputLabel>Income Type</InputLabel>
          <Select value={selectedIncomeType} onChange={(e) => setSelectedIncomeType(e.target.value)} required>
            <MenuItem value="">-- Select Income --</MenuItem>
            <MenuItem value="Salary">Salary</MenuItem>
            <MenuItem value="Rent">Rent</MenuItem>
            <MenuItem value="Investment">Investment</MenuItem>
            <MenuItem value="Stock">Stock</MenuItem>
            <MenuItem value="Extra Income">Extra Income</MenuItem>
            <MenuItem value="Other">Other</MenuItem>
          </Select>
        </FormControl>
        <TextField
          label="Date"
          type="date"
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true }}
          value={selectedIncomeDate}
          onChange={(e) => setSelectedIncomeDate(e.target.value)}
          required
        />
        <Button variant="contained" color="primary" fullWidth onClick={addIncome} sx={{ mt: 2 }}>Add Income</Button>
      </Box>
    </Modal>
  );
};

export default AddIncome;