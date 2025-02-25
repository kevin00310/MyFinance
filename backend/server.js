const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config(); 

const app = express();
const corsOptions = {
    origin: ["http://localhost:3000", "https://myfinance-5zg5.onrender.com"],
};

app.use(cors(corsOptions)); // Enable CORS for cross-origin requests
app.use(express.json()); // Parse incoming JSON data

// Example route
app.get('/api', (req, res) => {
  res.json({ message: 'Hello from the backend!' });
});

// Currency API route
app.get('/api/currency', async (req, res) => {
    try {
        const response = await axios.get(`https://anyapi.io/api/v1/exchange/rates?base=MYR&apiKey=k6npb5ukj081gue171s1brnq4do6ep96jesriha0rlem8p18aspg`, {
            headers: { apiKey: process.env.CURRENCY_API_KEY }, // Secure API key in .env file
        });
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching currency data:', error.message);
        res.status(500).json({ error: 'Failed to fetch currency data' });
    }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));