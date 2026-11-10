const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbFile = path.resolve(__dirname, 'books.db');
const db = new sqlite3.Database(dbFile, (err) => {
    if (err) {
        console.error('Error opening database', err.message);
    } else {
        console.log('Connected to the SQLite Book Tracker database.');
        
        db.serialize(() => {
            db.run(`CREATE TABLE IF NOT EXISTS books (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                author TEXT NOT NULL,
                status TEXT DEFAULT 'want_to_read',
                current_page INTEGER DEFAULT 0,
                total_pages INTEGER DEFAULT 100,
                rating INTEGER DEFAULT 0,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )`, (err) => {
                if (!err) {
                    // Seed initial sample books if empty
                    db.get(`SELECT COUNT(*) as count FROM books`, (err, row) => {
                        if (row && row.count === 0) {
                            const stmt = db.prepare(`INSERT INTO books (title, author, status, current_page, total_pages, rating) VALUES (?, ?, ?, ?, ?, ?)`);
                            stmt.run('Atomic Habits', 'James Clear', 'reading', 142, 320, 5);
                            stmt.run('The Pragmatic Programmer', 'Andrew Hunt', 'want_to_read', 0, 352, 0);
                            stmt.run('Clean Code', 'Robert C. Martin', 'completed', 464, 464, 4);
                            stmt.finalize();
                            console.log('Default book tracker sample data seeded.');
                        }
                    });
                }
            });
        });
    }
});

module.exports = db;