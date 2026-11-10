const express = require('express');
const cors = require('cors');
const db = require('./database');
const booksRouter = require('./routes/books'); // Import your books router

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Mount router -> makes endpoints available at /api/books
app.use('/api', booksRouter);

app.get('/', (req, res) => {
    res.json({ message: 'Book Tracker API is running!' });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});