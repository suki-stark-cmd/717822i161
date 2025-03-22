const express = require("express");
const axios = require("axios");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 9876;

const WINDOW_SIZE = 10;
let windowNumbers = [];

const API_URLS = {
  p: "http://20.244.56.144/test/primes",
  f: "http://20.244.56.144/test/fibo",
  e: "http://20.244.56.144/test/even",
  r: "http://20.244.56.144/test/rand"
};

app.use(express.json());

const fetchNumbersWithRetry = async (url, retries = 3) => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${process.env.ACCESS_TOKEN}`
        },
        timeout: 5000
      });
      return response.data.numbers;
    } catch (error) {
      console.error(`Attempt ${attempt}: Failed to fetch numbers`);
      if (attempt === retries) throw error;
    }
  }
};

app.get("/numbers/:numberid", async (req, res) => {
  const numberType = req.params.numberid;

  if (!API_URLS[numberType]) {
    return res.status(400).json({ error: "Invalid number type!" });
  }

  try {
    const newNumbers = await fetchNumbersWithRetry(API_URLS[numberType]);

    if (!newNumbers || newNumbers.length === 0) {
      return res.status(500).json({ error: "No numbers received from API" });
    }

    const uniqueNumbers = newNumbers.filter(num => !windowNumbers.includes(num));
    windowNumbers = [...windowNumbers, ...uniqueNumbers].slice(-WINDOW_SIZE);

    const avg = windowNumbers.length
      ? (windowNumbers.reduce((sum, num) => sum + num, 0) / windowNumbers.length).toFixed(2)
      : 0;

    res.json({
      windowPrevState: windowNumbers.slice(0, -uniqueNumbers.length),
      windowCurrState: windowNumbers,
      numbers: uniqueNumbers,
      avg: parseFloat(avg)
    });

  } catch (error) {
    res.status(500).json({ error: "Failed to fetch numbers", details: error.message });
  }
});

app.get("/", (req, res) => {
  res.send("Server is running! Use /numbers/{numberid} to get numbers.");
});

app.listen(PORT, () => {
  console.log(`Server is running at: http://localhost:${PORT}/numbers/p`);
});
