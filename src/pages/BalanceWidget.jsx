import React, { useState, useEffect } from "react";
import { addTransaction } from "../function/addTransaction";
import { getTransaction } from "../function/getTransaction";
import { deleteTransaction } from "../function/deleteTransaction";
import axios from "axios";
import moment from "moment";
import { Box, Button, Typography } from "@mui/material";
import AddIncome from "../components/addIncome.jsx";
import AddExpenses from "../components/addExpenses.jsx";
import AddBalance from "../components/addBalance.jsx";
import ResetBalance from "../components/resetBalance.jsx";

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

  // fetch currency from API
  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        const baseURL = "https://myfinance-backend-pv55.onrender.com";
        const response = await axios.get(`${baseURL}/api/currency`);
        const data = response.data.data;

        // filter currencies (buying_rate, selling_rate, or middle_rate) is null
        const validCurrencies = data.filter(item =>
          item.rate.buying_rate !== null &&
          item.rate.selling_rate !== null &&
          item.rate.middle_rate !== null
        );

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

  // modal handlers
  const openAddIncomeModal = () => setAddIncomeModalVisible(true);
  const closeAddIncomeModal = () => {
    setAddIncomeModalVisible(false);
    setSelectedIncomeAmount("");
    setSelectedIncomeName("");
    setSelectedCurrency("");
    setSelectedIncomeType("");
    setSelectedIncomeDate("");
  };
  const openAddExpensesModal = () => setAddExpensesModalVisible(true);
  const closeAddExpensesModal = () => {
    setAddExpensesModalVisible(false);
    setSelectedExpensesAmount("");
    setSelectedExpensesName("");
    setSelectedCurrency("");
    setSelectedExpensesType("");
    setSelectedExpensesDate("");
  };
  const openAddBalanceModal = () => setAddBalanceModalVisible(true);
  const closeAddBalanceModal = () => {
    setAddBalanceModalVisible(false);
    setSelectedBalanceAmount("");
    setSelectedCurrency("");
  };
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
    closeAddBalanceModal();
  };

  // reset transactions
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

    // check collection is empty
    try {
      const remainingTransactions = await getTransaction(uid);
      if (remainingTransactions.length === 0) {
        // collection is empty, consider the operation successful
        setTransactions([]);
        setBalance(0);
        alert("All transaction data has been cleared!");
        window.location.reload();
      } else {
        // some documents remain, operation failed
        console.log("Failed to clear all transactions. Some data remains. Please try again.");
        operationFailed = true;
      }
    } catch (error) {
      console.error("Error checking remaining transactions:", error.message, error.code, error);
      console.log("Error verifying transaction deletion. Please check manually.");
      operationFailed = true;
    } finally {
      console.log("Closing confirmation modal...");
      closeConfirmResetModal();
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

      {/* Add Income Modal */}
      <AddIncome
        open={isAddIncomeModalVisible}
        onClose={closeAddIncomeModal}
        currencies={currencies}
        selectedCurrency={selectedCurrency}
        setSelectedCurrency={setSelectedCurrency}
        selectedIncomeAmount={selectedIncomeAmount}
        setSelectedIncomeAmount={setSelectedIncomeAmount}
        selectedIncomeName={selectedIncomeName}
        setSelectedIncomeName={setSelectedIncomeName}
        selectedIncomeType={selectedIncomeType}
        setSelectedIncomeType={setSelectedIncomeType}
        selectedIncomeDate={selectedIncomeDate}
        setSelectedIncomeDate={setSelectedIncomeDate}
        addIncome={addIncome}
      />

      {/* Add Expenses Modal */}
      <AddExpenses
        open={isAddExpensesModalVisible}
        onClose={closeAddExpensesModal}
        currencies={currencies}
        selectedCurrency={selectedCurrency}
        setSelectedCurrency={setSelectedCurrency}
        selectedExpensesAmount={selectedExpensesAmount}
        setSelectedExpensesAmount={setSelectedExpensesAmount}
        selectedExpensesName={selectedExpensesName}
        setSelectedExpensesName={setSelectedExpensesName}
        selectedExpensesType={selectedExpensesType}
        setSelectedExpensesType={setSelectedExpensesType}
        selectedExpensesDate={selectedExpensesDate}
        setSelectedExpensesDate={setSelectedExpensesDate}
        addExpenses={addExpenses}
      />

      {/* Add Balance Modal */}
      <AddBalance
        open={isAddBalanceModalVisible}
        onClose={closeAddBalanceModal}
        currencies={currencies}
        selectedCurrency={selectedCurrency}
        setSelectedCurrency={setSelectedCurrency}
        selectedBalanceAmount={selectedBalanceAmount}
        setSelectedBalanceAmount={setSelectedBalanceAmount}
        addBalance={addBalance}
      />

      {/* Reset Balance Modal */}
      <ResetBalance
        open={isConfirmResetModalVisible}
        onClose={closeConfirmResetModal}
        resetTransactions={resetTransactions}
      />
    </Box>
  );
};