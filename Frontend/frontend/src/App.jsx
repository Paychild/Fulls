import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [books, setBooks] = useState([]);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [totalPages, setTotalPages] = useState(250);
  const [filter, setFilter] = useState('all');

  const fetchBooks = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/books');
      const result = await res.json();
      if (result.data) setBooks(result.data);
    } catch (err) {
      console.error('Error fetching books:', err);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleAddBook = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/books', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          title, 
          author, 
          status: 'want_to_read', 
          current_page: 0, 
          total_pages: Number(totalPages),
          rating: 0 
        })
      });

      if (response.ok) {
        setTitle('');
        setAuthor('');
        setTotalPages(250);
        fetchBooks();
      }
    } catch (err) {
      console.error('Error adding book:', err);
    }
  };

  const handleUpdateProgress = async (id, newPage, total) => {
    let newStatus = 'reading';
    if (newPage >= total) newStatus = 'completed';
    if (newPage <= 0) newStatus = 'want_to_read';

    try {
      const response = await fetch(`http://localhost:5000/api/books/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ current_page: newPage, status: newStatus })
      });

      if (response.ok) fetchBooks();
    } catch (err) {
      console.error('Error updating progress:', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/books/${id}`, {
        method: 'DELETE'
      });
      if (response.ok) fetchBooks();
    } catch (err) {
      console.error('Error deleting book:', err);
    }
  };

  const filteredBooks = books.filter(book => {
    if (filter === 'all') return true;
    return book.status === filter;
  });

  return (
    <div style={{ maxWidth: '900px', margin: '30px auto', fontFamily: 'Arial, sans-serif', padding: '20px' }}>
      <h1>📖 ShelfLife Reading Tracker</h1>

      {/* Add Book Form */}
      <form onSubmit={handleAddBook} style={{ background: '#f8f9fa', padding: '20px', borderRadius: '8px', marginBottom: '25px', display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
        <div style={{ flex: '2 1 200px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Book Title:</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="e.g. Atomic Habits" style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} />
        </div>
        <div style={{ flex: '2 1 200px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Author:</label>
          <input type="text" value={author} onChange={(e) => setAuthor(e.target.value)} required placeholder="e.g. James Clear" style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} />
        </div>
        <div style={{ flex: '1 1 100px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Total Pages:</label>
          <input type="number" value={totalPages} onChange={(e) => setTotalPages(e.target.value)} required style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} />
        </div>
        <button type="submit" style={{ background: '#28a745', color: 'white', border: 'none', padding: '9px 16px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
          Add Book
        </button>
      </form>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        {['all', 'want_to_read', 'reading', 'completed'].map(tab => (
          <button 
            key={tab}
            onClick={() => setFilter(tab)}
            style={{ 
              padding: '6px 14px', 
              borderRadius: '20px', 
              border: '1px solid #ccc', 
              background: filter === tab ? '#007bff' : 'white',
              color: filter === tab ? 'white' : '#333',
              cursor: 'pointer',
              textTransform: 'capitalize'
            }}
          >
            {tab.replace(/_/g, ' ')}
          </button>
        ))}
      </div>

      {/* Book List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {filteredBooks.map(book => {
          const progressPercent = Math.round((book.current_page / book.total_pages) * 100) || 0;
          return (
            <div key={book.id} style={{ background: 'white', border: '1px solid #e0e0e0', padding: '16px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h3 style={{ margin: '0 0 5px 0' }}>{book.title}</h3>
                  <p style={{ margin: '0 0 10px 0', color: '#666', fontSize: '0.95rem' }}>By {book.author}</p>
                </div>
                <span style={{ 
                  fontSize: '0.8rem', padding: '3px 8px', borderRadius: '12px', fontWeight: 'bold',
                  background: book.status === 'completed' ? '#d4edda' : book.status === 'reading' ? '#cce5ff' : '#fff3cd',
                  color: book.status === 'completed' ? '#155724' : book.status === 'reading' ? '#004085' : '#856404'
                }}>
                  {book.status.replace(/_/g, ' ').toUpperCase()}
                </span>
              </div>

              {/* Progress Bar */}
              <div style={{ margin: '12px 0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px', color: '#555' }}>
                  <span>Progress: Page {book.current_page} of {book.total_pages}</span>
                  <span>{progressPercent}%</span>
                </div>
                <div style={{ background: '#e9ecef', borderRadius: '4px', height: '8px', width: '100%', overflow: 'hidden' }}>
                  <div style={{ background: '#007bff', height: '100%', width: `${progressPercent}%`, transition: 'width 0.3s ease' }}></div>
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px', borderTop: '1px solid #f1f1f1', paddingTop: '10px' }}>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button 
                    onClick={() => handleUpdateProgress(book.id, Math.max(0, book.current_page - 10), book.total_pages)}
                    style={{ padding: '4px 8px', fontSize: '0.8rem', cursor: 'pointer' }}
                  >
                    -10 Pages
                  </button>
                  <button 
                    onClick={() => handleUpdateProgress(book.id, Math.min(book.total_pages, book.current_page + 10), book.total_pages)}
                    style={{ padding: '4px 8px', fontSize: '0.8rem', cursor: 'pointer' }}
                  >
                    +10 Pages
                  </button>
                </div>
                <button 
                  onClick={() => handleDelete(book.id)}
                  style={{ background: 'transparent', color: '#dc3545', border: 'none', cursor: 'pointer', fontSize: '0.85rem' }}
                >
                  Remove Book
                </button>
              </div>
            </div>
          );
        })}
        {filteredBooks.length === 0 && (
          <p style={{ textAlign: 'center', color: '#777', fontStyle: 'italic' }}>No books found in this view.</p>
        )}
      </div>
    </div>
  );
}

export default App;