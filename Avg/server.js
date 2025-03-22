const express = require('express');
const axios = require('axios');

const app = express();
const port = 9876;
const windowSize = 10;

let windowNumbers = [];

app.get('/numbers/:numberid', async (req, res) => {
    const numberId = req.params.numberid;
    const url = getUrlForNumberId(numberId);

    try {
        const response = await axios.get(url, {
            headers: {
                'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzQyNjIzNzg3LCJpYXQiOjE3NDI2MjM0ODcsImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6IjBkZGVjMWVlLWUwZjctNGJhYi05NmNkLTI1MzViNTA0YjQwOSIsInN1YiI6IjcxNzgyMmkxNjFAa2NlLmFjLmluIn0sImNvbXBhbnlOYW1lIjoiS2FycGFnYW1jb2xsZWdlb2ZlbmdpbmVlcmluZyIsImNsaWVudElEIjoiMGRkZWMxZWUtZTBmNy00YmFiLTk2Y2QtMjUzNWI1MDRiNDA5IiwiY2xpZW50U2VjcmV0IjoiWGF3Tk5selJ2UVlhaWpaUCIsIm93bmVyTmFtZSI6IlN1a2lTIiwib3duZXJFbWFpbCI6IjcxNzgyMmkxNjFAa2NlLmFjLmluIiwicm9sbE5vIjoiNzE3ODIyaTE2MSJ9.lDcmwW76gfFp9oWArJhQK8odVVlIEL0ic3v0vO_7p4c'
            },
            timeout: 500
        });

        const newNumbers = response.data.numbers.filter(num => !windowNumbers.includes(num));
        const windowPrevState = [...windowNumbers];

        newNumbers.forEach(num => {
            if (windowNumbers.length >= windowSize) {
                windowNumbers.shift();
            }
            windowNumbers.push(num);
        });

        const avg = calculateAverage(windowNumbers);

        res.json({
            windowPrevState,
            windowCurrState: windowNumbers,
            numbers: newNumbers,
            avg: avg.toFixed(2)
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch numbers' });
    }
});

function getUrlForNumberId(numberId) {
    switch (numberId) {
        case 'p':
            return 'http://20.244.56.144/test/primes';
        case 'f':
            return 'http://20.244.56.144/test/fibo';
        case 'e':
            return 'http://20.244.56.144/test/even';
        case 'r':
            return 'http://20.244.56.144/test/rand';
        default:
            throw new Error('Invalid number ID');
    }
}

function calculateAverage(numbers) {
    const sum = numbers.reduce((acc, num) => acc + num, 0);
    return sum / numbers.length;
}

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});