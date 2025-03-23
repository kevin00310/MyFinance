import React, { useState, useEffect } from "react";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { getTransaction } from "../function/getTransaction";
import "./Home.css";

export const TransactionWidget = ({ uid }) => {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("");
  const [showExportPopup, setShowExportPopup] = useState(false);
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");

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
    let sortedTransactions = [...transactions];
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
          (transaction) => transaction.transaction === "Income"
        );
        break;
      case "typeExpenses":
        sortedTransactions = sortedTransactions.filter(
          (transaction) => transaction.transaction === "Expenses"
        );
        break;
      default:
        sortedTransactions = [...transactions];
    }
    setFilteredTransactions(sortedTransactions);
    setSortOption(option);
  };

  const filterByDate = (transactions, year, month) => {
    return transactions.filter((transaction) => {
      const transactionDate = new Date(transaction.date);
      const transactionYear = transactionDate.getFullYear();
      const transactionMonth = transactionDate.getMonth() + 1; // Months are 0-indexed
      return (
        (!year || transactionYear === parseInt(year)) &&
        (!month || transactionMonth === parseInt(month))
      );
    });
  };

  const exportCSV = () => {
    const dataToExport = filterByDate(filteredTransactions, selectedYear, selectedMonth);
    const csvData = dataToExport.map((transaction) => ({
      Date: transaction.date,
      Name: transaction.name,
      Type: transaction.type,
      Tag: transaction.tag,
      Transaction: transaction.transaction,
      Amount: transaction.amount,
      "Converted Amount": transaction.convertedAmount,
    }));

    const csvContent = [
      Object.keys(csvData[0] || {}).join(","),
      ...csvData.map((row) => Object.values(row).join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "transactions.csv");
  };

  const exportExcel = () => {
    const dataToExport = filterByDate(filteredTransactions, selectedYear, selectedMonth);
    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Transactions");
    XLSX.writeFile(workbook, "transactions.xlsx");
  };

  const exportPDF = () => {
    const dataToExport = filterByDate(filteredTransactions, selectedYear, selectedMonth);
    const doc = new jsPDF();
    const tableColumn = [
      "Date",
      "Name",
      "Type",
      "Tag",
      "Transaction",
      "Amount",
      "Converted Amount",
    ];
    const tableRows = dataToExport.map((transaction) => [
      transaction.date,
      transaction.name,
      transaction.type,
      transaction.tag,
      transaction.transaction,
      transaction.amount.toFixed(2),
      transaction.convertedAmount.toFixed(2),
    ]);

    doc.text("Transaction History", 14, 10);
    console.log(typeof jsPDF().autoTable); // Should print "function"

    doc.autoTable({ head: [tableColumn], body: tableRows, startY: 20 });
    console.log(typeof jsPDF().autoTable); // Should print "function"

    doc.save("transactions.pdf");
  };

  return (
    <div className="TransactionWidget">
      <div className="TableHeader">
        <h2>Transaction History</h2>
        <button className="exportBtn" onClick={() => setShowExportPopup(true)}>Export to</button>
       
      </div>
      {showExportPopup && (
        <div className="modal-overlay">
          <div className="modal-content exportFormat">
            <h3>Select Year and Month</h3>
            <div className="modal-controls">
        <label>
          Year:
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
          >
            <option value="">All</option>
            {[...new Set(transactions.map((t) => new Date(t.date).getFullYear()))]
              .sort((a, b) => b - a)
              .map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
          </select>
        </label>
        <label>
          Month:
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          >
            <option value="">All</option>
            {[...Array(12).keys()].map((month) => (
              <option key={month + 1} value={month + 1}>
                {new Date(0, month).toLocaleString("default", {
                  month: "long",
                })}
              </option>
            ))}
          </select>
        </label>
      </div>
            <button className="modal-button" onClick={exportCSV}>
              Export to CSV
            </button>
            <button className="modal-button" onClick={exportExcel}>
              Export to Excel
            </button>
            <button className="modal-button" onClick={exportPDF}>
              Export to PDF
            </button>
            <button
              className="close-button"
              onClick={() => setShowExportPopup(false)}
            >
              ×
            </button>
          </div>
        </div>
      )}
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
