const getFlagIcon = (currencyCode) => {
    // special case for EUR (Eurozone)
    if (currencyCode === 'EUR') {
      return '🇪🇺'; // EU flag for Euro
    }
  
    // extract first 2 letters of the currency code ("US" from "USD")
    const countryCode = currencyCode.slice(0, 2).toUpperCase();
  
    // convert each letter to a regional indicator symbol
    const regionalIndicatorOffset = 0x1F1E6 - 0x41; // offset from 'A' to 🇦
    const codePoints = countryCode
      .split('')
      .map(char => char.charCodeAt(0) + regionalIndicatorOffset);
  
    // convert code points to a string (e.g., "US" → 🇺🇸)
    return String.fromCodePoint(...codePoints);
  };
  
  export default getFlagIcon;