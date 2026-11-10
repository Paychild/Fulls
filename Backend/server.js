const express = require('express');
const path = require('path');
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

app.use(express.static(path.join(__dirname, '../frontend/dist')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/dist', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});