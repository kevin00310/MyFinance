import React, { useState, useEffect } from "react";
import { getTransaction } from "../function/getTransaction";
import "./Home.css";

export const TransactionWidget = ({ uid }) => {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("");

  useEffect(() => {
    // load transactions from local storage on component mount
    const storedTransactions = JSON.parse(localStorage.getItem("transactions")) || [];
    setTransactions(storedTransactions);
    setFilteredTransactions(storedTransactions);
  }, []);
  

  // fetch transactions data when component is mounted or uid changes
  useEffect(() => {
    const fetchTransactions = async () => {
      const fetchedTransactions = await getTransaction(uid);
      setTransactions(fetchedTransactions);
      setFilteredTransactions(fetchedTransactions);
    };

    fetchTransactions();
  }, [uid]);

  // filter transactions based on search term
  useEffect(() => {
    const lowercasedSearchTerm = searchTerm.toLowerCase();
    const results = transactions.filter((transaction) =>
      Object.values(transaction).some((value) =>
        value.toString().toLowerCase().includes(lowercasedSearchTerm)
      )
    );
    setFilteredTransactions(results);
  }, [searchTerm, transactions]);

  // sort transactions based on selected option
  const handleSort = (option) => {
    let sortedTransactions = [...filteredTransactions];
    switch (option) {
      case "dateNewest":
        sortedTransactions.sort((a, b) => new Date(b.date) - new Date(a.date));
        break;
      case "dateOldest":
        sortedTransactions.sort((a, b) => new Date(a.date) - new Date(b.date));
        break;
      case "amountBig":
        sortedTransactions.sort((a, b) => b.amount - a.amount);
        break;
      case "amountSmall":
        sortedTransactions.sort((a, b) => a.amount - b.amount);
        break;
      case "typeIncome":
        sortedTransactions = sortedTransactions.filter(
          (transaction) => transaction.type === "Income"
        );
        break;
      case "typeExpenses":
        sortedTransactions = sortedTransactions.filter(
          (transaction) => transaction.type === "Expenses"
        );
        break;
      default:
        sortedTransactions = transactions;
    }
    setFilteredTransactions(sortedTransactions);
    setSortOption(option);
  };

  return (
    <div className="TransactionWidget">
      <h2>Transaction History</h2>
      <div className="controls">
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          value={sortOption}
          onChange={(e) => handleSort(e.target.value)}
        >
          <option value="">Sort By</option>
          <option value="dateNewest">Date (Newest)</option>
          <option value="dateOldest">Date (Oldest)</option>
          <option value="amountBig">Amount (Biggest)</option>
          <option value="amountSmall">Amount (Smallest)</option>
          <option value="typeIncome">Type (Income)</option>
          <option value="typeExpenses">Type (Expenses)</option>
        </select>
      </div>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Name</th>
            <th>Type</th>
            <th>Tag</th>
            <th>Transaction</th>
            <th>Amount</th>
            <th>Converted Amount</th>
          </tr>
        </thead>
        <tbody>
          {filteredTransactions.length > 0 ? (
            filteredTransactions.map((transaction, index) => (
              <tr key={index}>
                <td>{transaction.date}</td>
                <td>{transaction.name}</td>
                <td>{transaction.type}</td>
                <td>{transaction.tag}</td>
                <td>{transaction.transaction}</td>
                <td>{transaction.amount.toFixed(2)}</td>
                <td>{transaction.convertedAmount.toFixed(2)}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7">No transactions available</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
