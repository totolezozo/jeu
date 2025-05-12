// routes/rent.js
const express = require('express');
const router = express.Router();
const db = require('../db/connection');

// Get all rental records
router.get('/', (req, res) => {
  const query = `
    SELECT r.gameid, r.UserId, r.rentalDate, r.DueDate, r.status,
           g.title, u.Username
    FROM rent r
    LEFT JOIN game g ON r.gameid = g.gameid
    LEFT JOIN Users u ON r.UserId = u.UserId
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('DB Error:', err);
      return res.status(500).json({ error: 'Database error', details: err.message });
    }
    res.json(results);
  });
});

// Get rentals for a specific user
router.get('/user/:userId', (req, res) => {
  const userId = req.params.userId;
  const query = `
    SELECT r.gameid, r.rentalDate, r.DueDate, r.status,
           g.title
    FROM rent r
    LEFT JOIN game g ON r.gameid = g.gameid
    WHERE r.UserId = ?
  `;

  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error('DB Error:', err);
      return res.status(500).json({ error: 'Database error', details: err.message });
    }
    res.json(results);
  });
});

router.post('/', (req, res) => {
  const { gameid, userId, rentalDate, DueDate } = req.body;
  const status = 'rented';

  console.log('[RENT] Incoming rental:', { gameid, userId, rentalDate, DueDate });

  const query = `INSERT INTO rent (gameid, UserId, rentalDate, DueDate, status) VALUES (?, ?, ?, ?, ?)`;

  db.query(query, [gameid, userId, rentalDate, DueDate, status], (err, result) => {
    if (err) {
      console.error('[RENT] DB Error:', err);
      return res.status(500).json({ error: 'Database error', details: err.message });
    }

    console.log('[RENT] Rental added successfully');
    res.status(201).json({ message: 'Rental created', rentalId: gameid });
  });
});


// Update rental status (e.g., mark as returned)
router.put('/:gameid/status', (req, res) => {
  const gameid = req.params.gameid;
  const { status } = req.body; // e.g., 'returned'
  const query = `UPDATE rent SET status = ? WHERE gameid = ?`;

  db.query(query, [status, gameid], (err, result) => {
    if (err) {
      console.error('DB Error:', err);
      return res.status(500).json({ error: 'Database error', details: err.message });
    }
    res.json({ message: 'Rental status updated' });
  });
});

module.exports = router;
