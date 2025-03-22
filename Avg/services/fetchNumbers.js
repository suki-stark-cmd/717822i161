const axios = require("axios");
const dotenv = require("dotenv");

dotenv.config();

const API_URLS = {
    "p": "http://20.244.56.144/test/primes",
    "f": "http://20.244.56.144/test/fibo",
    "e": "http://20.244.56.144/test/even",
    "r": "http://20.244.56.144/test/rand"
};

const ACCESS_TOKEN = process.env.ACCESS_TOKEN;
const TOKEN_TYPE = process.env.TOKEN_TYPE;

async function fetchNumbers(type) {
    if (!API_URLS[type]) return null;

    try {
        const response = await axios.get(API_URLS[type], {
            timeout: 500,
            headers: {
                "Authorization": `${TOKEN_TYPE} ${ACCESS_TOKEN}`
            }
        });

        return response.data.numbers || [];
    } catch (error) {
        console.error("Error fetching numbers:", error.message);
        return null;
    }
}

module.exports = fetchNumbers;
