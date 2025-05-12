// routes/auth.js
const express = require('express');
const router  = express.Router();
const db      = require('../db/connection');

// Register
router.post('/register', (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ error: 'All fields are required.' });
  }
  db.query(
    'SELECT UserId FROM Users WHERE Username = ? OR email = ?',
    [username, email],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      if (rows.length) return res.status(409).json({ error: 'Username or email taken.' });

      db.query(
        'INSERT INTO Users (UserId, Username, email, password) VALUES (UUID(), ?, ?, ?)',
        [username, email, password],
        insertErr => {
          if (insertErr) return res.status(500).json({ error: insertErr.message });
          res.status(201).json({ message: 'Registered! Please log in.' });
        }
      );
    }
  );
});

// Login
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required.' });
  }
  db.query(
    'SELECT UserId, Username, email FROM Users WHERE Username = ? AND password = ?',
    [username, password],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!rows.length) return res.status(401).json({ error: 'Invalid credentials.' });

      // store user (minus password) in session
      req.session.user = rows[0];
      res.json({ message: 'Logged in', user: rows[0] });
    }
  );
});

// Logout
router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.json({ message: 'Logged out' });
  });
});

// Status
router.get('/status', (req, res) => {
  if (req.session.user) {
    return res.json({ loggedIn: true, user: req.session.user });
  }
  res.json({ loggedIn: false });
});

module.exports = router;
