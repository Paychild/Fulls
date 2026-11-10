const express = require('express');
const router = express.Router();
const db = require('../database');

// GET: Fetch all books
router.get('/books', (req, res) => {
    const sql = `SELECT * FROM books ORDER BY created_at DESC`;
    db.all(sql, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Success', data: rows });
    });
});

// POST: Add a new book
router.post('/books', (req, res) => {
    const { title, author, status, current_page, total_pages, rating } = req.body;
    const sql = `INSERT INTO books (title, author, status, current_page, total_pages, rating) VALUES (?, ?, ?, ?, ?, ?)`;
    const params = [
        title, 
        author, 
        status || 'want_to_read', 
        current_page || 0, 
        total_pages || 100, 
        rating || 0
    ];

    db.run(sql, params, function (err) {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.json({
            message: 'Success',
            data: { id: this.lastID, ...req.body }
        });
    });
});

// PATCH: Update book progress, status, or rating
router.patch('/books/:id', (req, res) => {
    const { status, current_page, rating } = req.body;
    const sql = `
        UPDATE books 
        SET status = COALESCE(?, status), 
            current_page = COALESCE(?, current_page), 
            rating = COALESCE(?, rating) 
        WHERE id = ?
    `;
    
    db.run(sql, [status, current_page, rating, req.params.id], function (err) {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.json({ message: 'Book updated successfully', changes: this.changes });
    });
});

// DELETE: Remove a book
router.delete('/books/:id', (req, res) => {
    const sql = `DELETE FROM books WHERE id = ?`;
    db.run(sql, req.params.id, function (err) {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.json({ message: 'Book deleted successfully', changes: this.changes });
    });
});

module.exports = router;