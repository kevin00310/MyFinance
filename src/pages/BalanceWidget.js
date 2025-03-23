import React, { useState, useEffect } from "react";
import { addTransaction } from "../function/addTransaction";
import { getTransaction } from "../function/getTransaction";
import "./Home.css";
import axios from "axios";
import moment from "moment";

export const BalanceWidget = ({ uid }) => {
  console.log("balance: " + uid);
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [currencies, setCurrencies] = useState([]); // store currency list
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

  // get user uid
  useEffect(() => {
    console.log("User UID in BalanceWidget:", uid);
    // can use uid for fetching user-specific data
  }, [uid]);

  // fetch the transaction data
  useEffect(() => {
    const fetchTransactions = async () => {
      if (!uid) {
        console.error("UID is undefined. Cannot fetch transactions.");
        return;
      }
  
      const fetchedTransactions = await getTransaction(uid);
      setTransactions(fetchedTransactions);
  
      // calculate the total balance based on transaction type
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

  // fetch currency from backend
  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        const baseURL = "https://myfinance-backend-pv55.onrender.com";
        const response = await axios.get(`${baseURL}/api/currency`);
        const data = response.data.data;
        const currencyData = data.map((item) => item.currency_code);
        const rates = data.reduce((acc, item) => {
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

  // the Income Expenses Balance modal show / hide
  const openAddIncomeModal = () => {
    setAddIncomeModalVisible(true);
  };

  const closeAddIncomeModal = () => {
    setAddIncomeModalVisible(false);
  };

  const openAddExpensesModal = () => {
    setAddExpensesModalVisible(true);
  };

  const closeAddExpensesModal = () => {
    setAddExpensesModalVisible(false);
  };

  const openAddBalanceModal = () => {
    setAddBalanceModalVisible(true);
  };

  const closeAddBalanceModal = () => {
    setAddBalanceModalVisible(false);
  };

  // convert the amount base on currency
  const calculateConvertedAmount = () => {
    let amount = 0;

    if (selectedIncomeAmount !== "") {
      amount = parseFloat(selectedIncomeAmount);
    } else if (selectedExpensesAmount !== "") {
      amount = parseFloat(selectedExpensesAmount);
    } else if (selectedBalanceAmount !== "") {
      amount = parseFloat(selectedBalanceAmount);
    }

    // convert to MYR
    if (selectedCurrency === "MYR") {
      return amount; // Already in MYR
    } else {
      const rate = exchangeRates[selectedCurrency];
      if (rate) {
        return amount / rate; // Convert to MYR
      }
      return 0; // Fallback for invalid rate
    }
  };

  // add income details to database
  const addIncome = () => {
    if (
      !selectedIncomeAmount ||
      !selectedIncomeName ||
      !selectedCurrency ||
      !selectedIncomeType ||
      !selectedIncomeDate
    ) {
      alert("Please fill out all fields!");
      return;
    } else if (selectedIncomeAmount <= 0) {
      alert("Amount must be POSITIVE!");
      return;
    } else {
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

      console.log([newTransaction]);

      setTransactions([...transactions, newTransaction]);
      addTransaction(newTransaction);

      setSelectedIncomeAmount("");
      setSelectedIncomeName("");
      setSelectedCurrency("");
      setSelectedIncomeType("");
      setSelectedIncomeDate("");
    }
  };

  // add expenses detail to database
  const addExpenses = () => {
    if (
      !selectedExpensesAmount ||
      !selectedExpensesName ||
      !selectedCurrency ||
      !selectedExpensesType ||
      !selectedExpensesDate
    ) {
      alert("Please fill out all fields!");
      return;
    } else if (selectedExpensesAmount <= 0) {
      alert("Amount must be POSITIVE!");
      return;
    } else {
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

      console.log([newTransaction]);

      setTransactions([...transactions, newTransaction]);
      addTransaction(newTransaction);

      setSelectedExpensesAmount("");
      setSelectedExpensesName("");
      setSelectedCurrency("");
      setSelectedExpensesType("");
      setSelectedExpensesDate("");
    }
  };

  // add balance detail to database
  const addBalance = () => {
    if (!selectedBalanceAmount) {
      alert("Please fill out the fields!");
      return;
    } else if (selectedBalanceAmount <= 0) {
      alert("Amount must be POSITIVE!");
      return;
    } else {
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

      console.log([newTransaction]);

      setTransactions([...transactions, newTransaction]);
      addTransaction(newTransaction);

      setSelectedBalanceAmount("");
      setSelectedCurrency("");
    }
  };

  // get all transaction from database
  const getTransactionData = () => {
    console.log(uid);
    getTransaction(uid);
  };

  // havent link to firebase to clear the record, wait for adding
  const resetBalance = () => {
    setBalance(0);
  };

  return (
    <div className="IncomeExpenses">
      <h2>Balance: RM {balance.toFixed(2)}</h2>
      <div className="buttons">
        <button className="button income" onClick={openAddIncomeModal}>
          Add Income
        </button>
        <button className="button expenses" onClick={openAddExpensesModal}>
          Add Expenses
        </button>
        {/* Conditionally Render Balance or Reset Button */}
        {balance === 0 ? (
          <button className="button balance" onClick={openAddBalanceModal}>
            Balance
          </button>
        ) : (
          <button className="button reset" onClick={resetBalance}>
            Reset
          </button>
        )}
      </div>

      {/* Income Widget */}
      {isAddIncomeModalVisible && (
        <div className="modal-overlay">
          <div className="modalIncome">
            <button className="close-button" onClick={closeAddIncomeModal}>
              ×
            </button>
            <h3>Add Income</h3>
            <form>
              {/* Amount Input */}
              <label htmlFor="income-amount">Amount</label>
              <input
                type="number"
                id="income-amount"
                name="amount"
                placeholder="Enter amount"
                value={selectedIncomeAmount}
                onChange={(e) => setSelectedIncomeAmount(e.target.value)}
                required
              />

              {/* Name Input */}
              <label htmlFor="income-name">Name</label>
              <input
                type="text"
                id="income-name"
                name="name"
                placeholder="Enter name"
                value={selectedIncomeName}
                onChange={(e) => setSelectedIncomeName(e.target.value)}
                required
              />

              {/* Currency Selection */}
              <label htmlFor="currency-select">Currency</label>
              <select
                id="currency-select"
                name="currency"
                value={selectedCurrency}
                onChange={(e) => setSelectedCurrency(e.target.value)}
                required
              >
                <option value="">-- Select Currency --</option>
                <option value="MYR">MYR</option>
                {currencies.map((currency) => (
                  <option key={currency} value={currency}>
                    {currency}
                  </option>
                ))}
              </select>

              {/* Income Type Dropdown */}
              <label htmlFor="income-type">Income Type</label>
              <select
                id="income-type"
                name="type"
                required
                value={selectedIncomeType}
                onChange={(e) => setSelectedIncomeType(e.target.value)}
              >
                <option value="">-- Select Income --</option>
                <option value="salary">Salary</option>
                <option value="rent">Rent</option>
                <option value="investment">Investment</option>
                <option value="stock">Stock</option>
                <option value="other">Other</option>
              </select>

              {/* Date Picker */}
              <label htmlFor="income-date">Date</label>
              <input
                type="date"
                id="income-date"
                name="date"
                value={selectedIncomeDate}
                onChange={(e) => setSelectedIncomeDate(e.target.value)}
                required
              />

              {/* Submit Button */}
              <button
                type="button"
                className="modal-button"
                onClick={addIncome}
              >
                Add Income
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Expenses Widget */}
      {isAddExpensesModalVisible && (
        <div className="modal-overlay">
          <div className="modalExpenses">
            <button className="close-button" onClick={closeAddExpensesModal}>
              ×
            </button>
            <h3>Add Expenses</h3>
            <form>
              {/* Amount Input */}
              <label htmlFor="expenses-amount">Amount</label>
              <input
                type="number"
                id="expenses-amount"
                name="amount"
                placeholder="Enter amount"
                value={selectedExpensesAmount}
                onChange={(e) => setSelectedExpensesAmount(e.target.value)}
                required
              />

              {/* Name Input */}
              <label htmlFor="expenses-name">Name</label>
              <input
                type="text"
                id="expenses-name"
                name="name"
                placeholder="Enter name"
                value={selectedExpensesName}
                onChange={(e) => setSelectedExpensesName(e.target.value)}
                required
              />

              {/* Currency Selection */}
              <label htmlFor="currency-select">Currency</label>
              <select
                id="currency-select"
                name="currency"
                value={selectedCurrency}
                onChange={(e) => setSelectedCurrency(e.target.value)}
                required
              >
                <option value="">-- Select Currency --</option>
                <option value="MYR">MYR</option>
                {currencies.map((currency) => (
                  <option key={currency} value={currency}>
                    {currency}
                  </option>
                ))}
              </select>

              {/* Expenses Type Dropdown */}
              <label htmlFor="expenses-type">Expenses Type</label>
              <select
                id="expenses-type"
                name="type"
                required
                value={selectedExpensesType}
                onChange={(e) => setSelectedExpensesType(e.target.value)}
              >
                <option value="">-- Select Expenses --</option>
                <option value="F&B">Food & Beverage</option>
                <option value="Rent">Rent</option>
                <option value="Transport">Transport</option>
                <option value="Other">Other</option>
              </select>

              {/* Date Picker */}
              <label htmlFor="expenses-date">Date</label>
              <input
                type="date"
                id="expenses-date"
                name="date"
                value={selectedExpensesDate}
                onChange={(e) => setSelectedExpensesDate(e.target.value)}
                required
              />

              {/* Submit Button */}
              <button
                type="button"
                className="modal-button"
                onClick={addExpenses}
              >
                Add Expenses
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Balance Widget */}
      {isAddBalanceModalVisible && (
        <div className="modal-overlay">
          <div className="modalBalance">
            <button className="close-button" onClick={closeAddBalanceModal}>
              ×
            </button>
            <h3>Add Balance</h3>
            <form>
              {/* Amount Input */}
              <label htmlFor="balance-amount">Amount</label>
              <input
                type="number"
                id="balance-amount"
                name="amount"
                placeholder="Enter amount"
                value={selectedBalanceAmount}
                onChange={(e) => setSelectedBalanceAmount(e.target.value)}
                required
              />

              {/* Currency Selection */}
              <label htmlFor="currency-select">Currency</label>
              <select
                id="currency-select"
                name="currency"
                value={selectedCurrency}
                onChange={(e) => setSelectedCurrency(e.target.value)}
                required
              >
                <option value="">-- Select Currency --</option>
                {currencies.map((currency) => (
                  <option key={currency} value={currency}>
                    {currency}
                  </option>
                ))}
              </select>

              {/* Submit Button */}
              <button
                type="button"
                className="modal-button"
                onClick={addBalance}
              >
                Add Balance
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
