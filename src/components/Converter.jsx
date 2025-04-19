import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem, Select, InputLabel, FormControl, Avatar } from '@mui/material';
import convertIcon from "../img/convert.png";
import getFlagIcon from '../utils/getFlagIcon'; 

const Converter = ({ open, onClose }) => {
  const [currencies, setCurrencies] = useState([]);
  const [exchangeRates, setExchangeRates] = useState({}); // store rates adjusted for unit
  const [currencyUnits, setCurrencyUnits] = useState({}); // store unit for each currency
  const [fromCurrency, setFromCurrency] = useState(''); 
  const [toCurrency, setToCurrency] = useState(''); 
  const [fromAmount, setFromAmount] = useState('');
  const [toAmount, setToAmount] = useState('');
  const [lastEdited, setLastEdited] = useState(''); 

  // reset all inputs & selections when modal closes
  const handleClose = () => {
    setFromCurrency(''); 
    setToCurrency(''); 
    setFromAmount(''); 
    setToAmount(''); 
    setLastEdited(''); 
    onClose(); 
  };

  // fetch currencies from API
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

        // adjust rates for unit (rate per 1 unit of the currency)
        const rates = validCurrencies.reduce((acc, item) => {
          acc[item.currency_code] = item.rate.middle_rate / item.unit; // middle_rate, adjusted for unit
          return acc;
        }, {});

        // manual add MYR with a rate of 1 ( MYR is base )
        rates['MYR'] = 1; // 1 MYR = 1 MYR
        currencyData.push('MYR'); // Add MYR to the list of currencies

        // store units for reference if needed
        const units = validCurrencies.reduce((acc, item) => {
          acc[item.currency_code] = item.unit;
          return acc;
        }, {});
        units['MYR'] = 1; // MYR unit is 1

        setCurrencies(currencyData);
        setExchangeRates(rates);
        setCurrencyUnits(units);
      } catch (error) {
        console.error("Error fetching currencies:", error.message);
      }
    };
    fetchCurrencies();
  }, []);

  // conversion logic based on which amount was last edited
  useEffect(() => {
    if (!fromCurrency || !toCurrency || fromCurrency === toCurrency) {
      setFromAmount('');
      setToAmount('');
      return;
    }

    if (!exchangeRates[fromCurrency] || !exchangeRates[toCurrency]) {
      setFromAmount('');
      setToAmount('');
      return;
    }

    if (lastEdited === 'from' && fromAmount) {
      const amount = parseFloat(fromAmount);
      if (isNaN(amount)) {
        setToAmount('');
        return;
      }

      // convert from "currency1" currency to MYR
      let amountInMYR;
      if (fromCurrency === "MYR") {
        amountInMYR = amount;
      } else {
        const fromRate = exchangeRates[fromCurrency]; // Rate is already per 1 unit (e.g., 1 USD = 4.4165 MYR)
        amountInMYR = amount * fromRate; // 10 USD * 4.4165 = 44.165 MYR
      }

      // convert from MYR to "currency2" currency
      let convertedAmount;
      if (toCurrency === "MYR") {
        convertedAmount = amountInMYR;
      } else {
        const toRate = exchangeRates[toCurrency]; // Rate is already per 1 unit (e.g., 1 SGD = 3.3661 MYR)
        convertedAmount = amountInMYR / toRate; // 44.165 MYR / 3.3661 = 13.12 SGD
      }

      setToAmount(convertedAmount.toFixed(2));
    } else if (lastEdited === 'to' && toAmount) {
      const amount = parseFloat(toAmount);
      if (isNaN(amount)) {
        setFromAmount('');
        return;
      }

      // convert from "currency2" currency to MYR
      let amountInMYR;
      if (toCurrency === "MYR") {
        amountInMYR = amount;
      } else {
        const toRate = exchangeRates[toCurrency]; // Rate is already per 1 unit (e.g., 1 SGD = 3.3661 MYR)
        amountInMYR = amount * toRate; // 10 SGD * 3.3661 = 33.661 MYR
      }

      // convert from MYR to "currency1" currency
      let convertedAmount;
      if (fromCurrency === "MYR") {
        convertedAmount = amountInMYR;
      } else {
        const fromRate = exchangeRates[fromCurrency]; // Rate is already per 1 unit (e.g., 1 USD = 4.4165 MYR)
        convertedAmount = amountInMYR / fromRate; // e.g., 33.661 MYR / 4.4165 = 7.62 USD
      }

      setFromAmount(convertedAmount.toFixed(2));
    }
  }, [fromAmount, toAmount, fromCurrency, toCurrency, exchangeRates, lastEdited]);

  // currency change & prevent same currency selection
  const handleFromCurrencyChange = (e) => {
    const newCurrency = e.target.value;
    if (newCurrency === toCurrency) {
      // find different currency for "currency2" that isn't the new "currency1"
      const availableCurrencies = currencies.filter(c => c !== newCurrency);
      setToCurrency(availableCurrencies[0] || '');
    }
    setFromCurrency(newCurrency);
  };

  const handleToCurrencyChange = (e) => {
    const newCurrency = e.target.value;
    if (newCurrency === fromCurrency) {
      // find a different currency for "currency1" that isn't the new "currency2"
      const availableCurrencies = currencies.filter(c => c !== newCurrency);
      setFromCurrency(availableCurrencies[0] || '');
    }
    setToCurrency(newCurrency);
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Currency Converter</DialogTitle>
      <DialogContent>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
          <FormControl sx={{ minWidth: 120, marginRight: 2 }}>
            <InputLabel>Currency</InputLabel>
            <Select
              value={fromCurrency}
              onChange={handleFromCurrencyChange}
              label="currency1"
            >
              <MenuItem value="MYR">
                <span style={{ display: 'flex', alignItems: 'center' }}>
                  {getFlagIcon('MYR')} <span style={{ marginLeft: '8px' }}>MYR</span>
                </span>
              </MenuItem>
              {currencies
                .filter(currency => currency !== 'MYR')
                .sort() // sort alphabetically
                .map((currency) => (
                  <MenuItem key={currency} value={currency}>
                    <span style={{ display: 'flex', alignItems: 'center' }}>
                      {getFlagIcon(currency)} <span style={{ marginLeft: '8px' }}>{currency}</span>
                    </span>
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
          <TextField
            label="Amount"
            value={fromAmount}
            onChange={(e) => {
              setFromAmount(e.target.value);
              setLastEdited('from');
            }}
            variant="outlined"
            fullWidth
            type="number"
          />
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '16px' }}>
            <Avatar src={convertIcon} />
          </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <FormControl sx={{ minWidth: 120, marginRight: 2 }}>
            <InputLabel>Currency</InputLabel>
            <Select
              value={toCurrency}
              onChange={handleToCurrencyChange}
              label="currency2"
            >
              <MenuItem value="MYR">
                <span style={{ display: 'flex', alignItems: 'center' }}>
                  {getFlagIcon('MYR')} <span style={{ marginLeft: '8px' }}>MYR</span>
                </span>
              </MenuItem>
              {currencies
                .filter(currency => currency !== 'MYR')
                .sort() // sort alphabetically
                .map((currency) => (
                  <MenuItem key={currency} value={currency}>
                    <span style={{ display: 'flex', alignItems: 'center' }}>
                      {getFlagIcon(currency)} <span style={{ marginLeft: '8px' }}>{currency}</span>
                    </span>
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
          <TextField
            label="Amount"
            value={toAmount}
            onChange={(e) => {
              setToAmount(e.target.value);
              setLastEdited('to');
            }}
            variant="outlined"
            fullWidth
            type="number"
          />
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default Converter;