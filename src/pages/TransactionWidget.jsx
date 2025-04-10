import React, { useState, useEffect } from "react";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { getTransaction } from "../function/getTransaction";
import { deleteField } from "../function/deleteField";
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  TablePagination,
  Checkbox,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export const TransactionWidget = ({ uid }) => {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("");
  const [showExportPopup, setShowExportPopup] = useState(false);
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedTransactions, setSelectedTransactions] = useState([]);

  useEffect(() => {
    const storedTransactions = JSON.parse(localStorage.getItem("transactions")) || [];
    setTransactions(storedTransactions);
    setFilteredTransactions(storedTransactions);
  }, []);

  useEffect(() => {
    const fetchTransactions = async () => {
      const fetchedTransactions = await getTransaction(uid);
      setTransactions(fetchedTransactions);
      setFilteredTransactions(fetchedTransactions);
    };
    fetchTransactions();
  }, [uid]);

  useEffect(() => {
    const lowercasedSearchTerm = searchTerm.toLowerCase();
    const results = transactions.filter((transaction) =>
      Object.values(transaction).some((value) =>
        value.toString().toLowerCase().includes(lowercasedSearchTerm)
      )
    );
    setFilteredTransactions(results);
    setPage(0); // Reset to first page when filtering
  }, [searchTerm, transactions]);

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
    setPage(0); // Reset to first page when sorting
  };

  const filterByDate = (transactions, year, month) => {
    return transactions.filter((transaction) => {
      const transactionDate = new Date(transaction.date);
      const transactionYear = transactionDate.getFullYear();
      const transactionMonth = transactionDate.getMonth() + 1;
      return (
        (!year || transactionYear === parseInt(year)) &&
        (!month || transactionMonth === parseInt(month))
      );
    });
  };
  
  // export to CSV
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

  // export to Excel
  const exportExcel = () => {
    const dataToExport = filterByDate(filteredTransactions, selectedYear, selectedMonth);
    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Transactions");
    XLSX.writeFile(workbook, "transactions.xlsx");
  };

  // export to PDF
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
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });
    doc.save("transactions.pdf");
  };

  // Handle checkbox selection
  const handleCheckboxChange = (transactionId) => {
    setSelectedTransactions((prevSelected) =>
      prevSelected.includes(transactionId)
        ? prevSelected.filter((id) => id !== transactionId)
        : [...prevSelected, transactionId]
    );
  };

  // Handle delete button click
  const handleDeleteSelected = async () => {
    try {
      // Delete the selected transactions from Firestore
      await deleteField(uid, selectedTransactions);

      // Update the local state by removing the deleted transactions
      const updatedTransactions = transactions.filter(
        (transaction) => !selectedTransactions.includes(transaction.id)
      );
      setTransactions(updatedTransactions);
      setFilteredTransactions(updatedTransactions);

      // Clear the selected transactions
      setSelectedTransactions([]);

      alert("Selected transactions deleted successfully!");
    } catch (error) {
      console.error("Error deleting selected transactions:", error);
      alert("Failed to delete selected transactions. Please try again.");
    }
  };


  // change page (pagination)
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Calculate the transactions to display based on current page
  const paginatedTransactions = filteredTransactions.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Box sx={{ maxWidth: 1200,  padding: "1.5rem" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h5" fontWeight="bold">
          Transaction History
        </Typography>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button variant="contained" color="secondary" onClick={handleDeleteSelected} disabled={selectedTransactions.length === 0} >
            Delete
          </Button>
          <Button variant="contained" color="primary" onClick={() => setShowExportPopup(true)} >
            Export to
          </Button>
        </Box>
      </Box>

      <Dialog open={showExportPopup} onClose={() => setShowExportPopup(false)} >
        <DialogTitle>
          Select Export Options
          <IconButton
            aria-label="close"
            onClick={() => setShowExportPopup(false)}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mb: 2, }}>
            <InputLabel>Year</InputLabel>
            <Select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              label="Year"
            >
              <MenuItem value="">All</MenuItem>
              {[...new Set(transactions.map((t) => new Date(t.date).getFullYear()))]
                .sort((a, b) => b - a)
                .map((year) => (
                  <MenuItem key={year} value={year}>
                    {year}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Month</InputLabel>
            <Select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              label="Month"
            >
              <MenuItem value="">All</MenuItem>
              {[...Array(12).keys()].map((month) => (
                <MenuItem key={month + 1} value={month + 1}>
                  {new Date(0, month).toLocaleString("default", { month: "long" })}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={exportCSV} variant="contained" color="primary">
            CSV
          </Button>
          <Button onClick={exportExcel} variant="contained" color="primary">
            Excel
          </Button>
          <Button onClick={exportPDF} variant="contained" color="primary">
            PDF
          </Button>
        </DialogActions>
      </Dialog>

      <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Sort By</InputLabel>
          <Select
            value={sortOption}
            onChange={(e) => handleSort(e.target.value)}
            label="Sort By"
          >
            <MenuItem value="">Sort By</MenuItem>
            <MenuItem value="dateNewest">Date (Newest)</MenuItem>
            <MenuItem value="dateOldest">Date (Oldest)</MenuItem>
            <MenuItem value="amountBig">Amount (Biggest)</MenuItem>
            <MenuItem value="amountSmall">Amount (Smallest)</MenuItem>
            <MenuItem value="typeIncome">Type (Income)</MenuItem>
            <MenuItem value="typeExpenses">Type (Expenses)</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox"></TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Tag</TableCell>
              <TableCell>Transaction</TableCell>
              <TableCell align="right">Amount</TableCell>
              <TableCell align="right">Converted Amount</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedTransactions.length > 0 ? (
              paginatedTransactions.map((transaction, index) => (
                <TableRow key={index}>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedTransactions.includes(transaction.id)}
                      onChange={() => handleCheckboxChange(transaction.id)}
                    />
                  </TableCell>
                  <TableCell>{transaction.date}</TableCell>
                  <TableCell>{transaction.name}</TableCell>
                  <TableCell>{transaction.type}</TableCell>
                  <TableCell>{transaction.tag}</TableCell>
                  <TableCell>{transaction.transaction}</TableCell>
                  <TableCell align="right">{transaction.amount.toFixed(2)}</TableCell>
                  <TableCell align="right">{transaction.convertedAmount.toFixed(2)}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  No transactions available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[10, 25, 50]}
        component="div"
        count={filteredTransactions.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Box>
  );
};