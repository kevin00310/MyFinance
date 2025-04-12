import React, { useState, useEffect } from "react";
import { addTransaction } from "../function/addTransaction";
import { getTransaction } from "../function/getTransaction";
import { deleteTransaction } from "../function/deleteTransaction";
import axios from "axios";
import moment from "moment";
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

export const BalanceWidget = ({ uid }) => {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [currencies, setCurrencies] = useState([]);
  const [exchangeRates, setExchangeRates] = useState({});
  const [selectedCurrency, setSelectedCurrency] = useState("");
  const [selectedIncomeAmount, setSelectedIncomeAmount] = useState("");
  const [selectedIncomeName, setSelectedIncomeName] = useState("");
  const [selectedIncomeType, setSelectedIncomeType] = useState("");
  const [selectedIncomeDate, setSelectedIncomeDate] = useState("");
  const [isAddIncomeModalVisible, setAddIncomeModalVisible] = useState(false);
  const [selectedExpensesAmount, setSelectedExpensesAmount] = useState("");
  const [selectedExpensesName, setSelectedExpensesName] = useState("");
  const [selectedExpensesType, setSelectedExpensesType] = useState("");
  const [selectedExpensesDate, setSelectedExpensesDate] = useState("");
  const [isAddExpensesModalVisible, setAddExpensesModalVisible] = useState(false);
  const [selectedBalanceAmount, setSelectedBalanceAmount] = useState("");
  const [isAddBalanceModalVisible, setAddBalanceModalVisible] = useState(false);
  const [isConfirmResetModalVisible, setConfirmResetModalVisible] = useState(false);

  useEffect(() => {
    console.log("User UID in BalanceWidget:", uid);
  }, [uid]);

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!uid) {
        console.error("UID is undefined. Cannot fetch transactions.");
        return;
      }
      const fetchedTransactions = await getTransaction(uid);
      setTransactions(fetchedTransactions);
      const totalBalance = fetchedTransactions.reduce((currentBalance, transaction) => {
        switch (transaction.transaction) {
          case "Balance":
          case "Income":
            return currentBalance + transaction.convertedAmount;
          case "Expenses":
            return currentBalance - transaction.convertedAmount;
          default:
            return currentBalance;
        }
      }, 0);
      setBalance(totalBalance);
    };
    fetchTransactions();
  }, [uid]);

  // fetch currency form api
  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        const baseURL = "https://myfinance-backend-pv55.onrender.com";
        const response = await axios.get(`${baseURL}/api/currency`);
        const data = response.data.data;
        
        // filter with null buying_rate
        const validCurrencies = data.filter(item => item.rate.buying_rate !== null);
        
        const currencyData = validCurrencies.map((item) => item.currency_code);
        
        const rates = validCurrencies.reduce((acc, item) => {
          acc[item.currency_code] = item.rate.buying_rate;
          return acc;
        }, {});
        
        setCurrencies(currencyData);
        setExchangeRates(rates);
      } catch (error) {
        console.error("Error fetching currencies:", error.message);
      }
    };
    fetchCurrencies();
  }, []);

  // modal for income, expenses, balance
  const openAddIncomeModal = () => setAddIncomeModalVisible(true);
  const closeAddIncomeModal = () => setAddIncomeModalVisible(false);
  const openAddExpensesModal = () => setAddExpensesModalVisible(true);
  const closeAddExpensesModal = () => setAddExpensesModalVisible(false);
  const openAddBalanceModal = () => setAddBalanceModalVisible(true);
  const closeAddBalanceModal = () => setAddBalanceModalVisible(false);
  const openConfirmResetModal = () => setConfirmResetModalVisible(true);
  const closeConfirmResetModal = () => setConfirmResetModalVisible(false);

  // convert currency to MYR
  const calculateConvertedAmount = () => {
    let amount = 0;
    if (selectedIncomeAmount !== "") amount = parseFloat(selectedIncomeAmount);
    else if (selectedExpensesAmount !== "") amount = parseFloat(selectedExpensesAmount);
    else if (selectedBalanceAmount !== "") amount = parseFloat(selectedBalanceAmount);

    if (selectedCurrency === "MYR") return amount;
    const rate = exchangeRates[selectedCurrency];
    return rate ? amount / rate : 0;
  };

  // add income 
  const addIncome = () => {
    if (!selectedIncomeAmount || !selectedIncomeName || !selectedCurrency || !selectedIncomeType || !selectedIncomeDate) {
      alert("Please fill out all fields!");
      return;
    } else if (selectedIncomeAmount <= 0) {
      alert("Amount must be POSITIVE!");
      return;
    }
    const convertAmount = calculateConvertedAmount();
    const newTransaction = {
      uid,
      transaction: "Income",
      type: selectedIncomeType,
      amount: parseFloat(selectedIncomeAmount),
      convertedAmount: convertAmount,
      tag: selectedCurrency,
      date: moment(selectedIncomeDate).format("YYYY-MM-DD"),
      name: selectedIncomeName,
    };
    setTransactions([...transactions, newTransaction]);
    addTransaction(newTransaction);
    setSelectedIncomeAmount("");
    setSelectedIncomeName("");
    setSelectedCurrency("");
    setSelectedIncomeType("");
    setSelectedIncomeDate("");
    closeAddIncomeModal();
  };

  // add expenses
  const addExpenses = () => {
    if (!selectedExpensesAmount || !selectedExpensesName || !selectedCurrency || !selectedExpensesType || !selectedExpensesDate) {
      alert("Please fill out all fields!");
      return;
    } else if (selectedExpensesAmount <= 0) {
      alert("Amount must be POSITIVE!");
      return;
    }
    const convertAmount = calculateConvertedAmount();
    const newTransaction = {
      uid,
      transaction: "Expenses",
      type: selectedExpensesType,
      amount: parseFloat(selectedExpensesAmount),
      convertedAmount: convertAmount,
      tag: selectedCurrency,
      date: moment(selectedExpensesDate).format("YYYY-MM-DD"),
      name: selectedExpensesName,
    };
    setTransactions([...transactions, newTransaction]);
    addTransaction(newTransaction);
    setSelectedExpensesAmount("");
    setSelectedExpensesName("");
    setSelectedCurrency("");
    setSelectedExpensesType("");
    setSelectedExpensesDate("");
    closeAddExpensesModal();
  };

  // add balance
  const addBalance = () => {
    if (!selectedBalanceAmount || !selectedCurrency) {
      alert("Please fill out all fields!");
      return;
    } else if (selectedBalanceAmount <= 0) {
      alert("Amount must be POSITIVE!");
      return;
    }
    const convertAmount = calculateConvertedAmount();
    const balanceDate = new Date();
    const newTransaction = {
      uid,
      transaction: "Balance",
      type: "Balance",
      amount: parseFloat(selectedBalanceAmount),
      convertedAmount: convertAmount,
      tag: selectedCurrency,
      date: moment(balanceDate).format("YYYY-MM-DD"),
      name: "Balance",
    };
    setTransactions([...transactions, newTransaction]);
    addTransaction(newTransaction);
    setSelectedBalanceAmount("");
    setSelectedCurrency("");
    closeAddBalanceModal();
  };

  // reset balance 
  // const resetBalance = () => setBalance(0);
  const resetTransactions = async () => {
    let operationFailed = false;
    try {
      console.log("Starting resetTransactions...");
      const collectionPath = `users/${uid}/transactions`;
      await deleteTransaction(collectionPath);
      console.log("Firestore deletion completed successfully.");
    } catch (error) {
      console.error("Detailed error clearing transactions:", error.message, error.code, error);
      operationFailed = true;
    }

    // Check if the collection is actually empty
    try {
      const remainingTransactions = await getTransaction(uid);
      if (remainingTransactions.length === 0) {
        // Collection is empty, consider the operation successful
        setTransactions([]);
        setBalance(0);
        alert("All transaction data has been cleared!");
        window.location.reload();
      } else {
        // Some documents remain, operation failed
        alert("Failed to clear all transactions. Some data remains. Please try again.");
        operationFailed = true;
      }
    } catch (error) {
      console.error("Error checking remaining transactions:", error.message, error.code, error);
      alert("Error verifying transaction deletion. Please check manually.");
      operationFailed = true;
    } finally {
      console.log("Closing confirmation modal...");
      closeConfirmResetModal();
      // if (!operationFailed) {
      //   console.log("Refreshing page...");
      //   setTimeout(() => {
      //     window.location.reload();
      //   }, 1000); // Delay to ensure the alert is visible
      // }
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", p: 2 }}>
      <Typography variant="h5" color="text.primary">Balance: RM {balance.toFixed(2)}</Typography>
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, justifyContent: "center", mt: 2 }}>
        <Button variant="contained" color="primary" onClick={openAddIncomeModal}>Add Income</Button>
        <Button variant="contained" color="primary" onClick={openAddExpensesModal}>Add Expenses</Button>
        {balance === 0 ? (
          <Button variant="contained" color="primary" onClick={openAddBalanceModal}>Balance</Button>
        ) : (
          <Button variant="contained" color="primary" onClick={openConfirmResetModal}>Reset</Button>
        )}
      </Box>

      {/* Income Modal */}
      <Modal open={isAddIncomeModalVisible} onClose={closeAddIncomeModal}>
        <Box sx={modalStyle}>
          <IconButton sx={{ position: "absolute", top: 8, right: 8 }} onClick={closeAddIncomeModal}>
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
              <MenuItem value="MYR">MYR</MenuItem>
              {currencies.map((currency) => (
                <MenuItem key={currency} value={currency}>{currency}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel>Income Type</InputLabel>
            <Select value={selectedIncomeType} onChange={(e) => setSelectedIncomeType(e.target.value)} required>
              <MenuItem value="">-- Select Income --</MenuItem>
              <MenuItem value="salary">Salary</MenuItem>
              <MenuItem value="rent">Rent</MenuItem>
              <MenuItem value="investment">Investment</MenuItem>
              <MenuItem value="stock">Stock</MenuItem>
              <MenuItem value="other">Other</MenuItem>
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

      {/* Expenses Modal */}
      <Modal open={isAddExpensesModalVisible} onClose={closeAddExpensesModal}>
        <Box sx={modalStyle}>
          <IconButton sx={{ position: "absolute", top: 8, right: 8 }} onClick={closeAddExpensesModal}>
            <CloseIcon />
          </IconButton>
          <Typography variant="h6" align="center">Add Expenses</Typography>
          <TextField
            label="Amount"
            type="number"
            fullWidth
            margin="normal"
            value={selectedExpensesAmount}
            onChange={(e) => setSelectedExpensesAmount(e.target.value)}
            required
          />
          <TextField
            label="Name"
            fullWidth
            margin="normal"
            value={selectedExpensesName}
            onChange={(e) => setSelectedExpensesName(e.target.value)}
            required
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Currency</InputLabel>
            <Select value={selectedCurrency} onChange={(e) => setSelectedCurrency(e.target.value)} required>
              <MenuItem value="">-- Select Currency --</MenuItem>
              <MenuItem value="MYR">MYR</MenuItem>
              {currencies.map((currency) => (
                <MenuItem key={currency} value={currency}>{currency}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel>Expenses Type</InputLabel>
            <Select value={selectedExpensesType} onChange={(e) => setSelectedExpensesType(e.target.value)} required>
              <MenuItem value="">-- Select Expenses --</MenuItem>
              <MenuItem value="F&B">Food & Beverage</MenuItem>
              <MenuItem value="Rent">Rent</MenuItem>
              <MenuItem value="Transport">Transport</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Date"
            type="date"
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
            value={selectedExpensesDate}
            onChange={(e) => setSelectedExpensesDate(e.target.value)}
            required
          />
          <Button variant="contained" color="primary" fullWidth onClick={addExpenses} sx={{ mt: 2 }}>Add Expenses</Button>
        </Box>
      </Modal>

      {/* Balance Modal */}
      <Modal open={isAddBalanceModalVisible} onClose={closeAddBalanceModal}>
        <Box sx={modalStyle}>
          <IconButton sx={{ position: "absolute", top: 8, right: 8 }} onClick={closeAddBalanceModal}>
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
              <MenuItem value="MYR">MYR</MenuItem>
              {currencies.map((currency) => (
                <MenuItem key={currency} value={currency}>{currency}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button variant="contained" color="primary" fullWidth onClick={addBalance} sx={{ mt: 2 }}>Add Balance</Button>
        </Box>
      </Modal>

      {/* Confirmation Modal for Reset */}
      <Modal open={isConfirmResetModalVisible} onClose={closeConfirmResetModal}>
        <Box sx={modalStyle}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
            <Typography variant="h6">Confirm Reset</Typography>
            <IconButton onClick={closeConfirmResetModal}>
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
              onClick={closeConfirmResetModal}
              sx={{ flex: 1, ml: 1 }}
            >
              No
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};