// routes/review.js
const express = require('express');
const router = express.Router();
const db = require('../db/connection');

// Get all reviews for a specific game
router.get('/:gameid', (req, res) => {
  const gameId = req.params.gameid;
  const query = `
    SELECT 
      r.text,
      r.rating,
      r.reviewDate,
      u.Username
    FROM review r
    INNER JOIN Users u ON r.UserId = u.UserId
    WHERE r.gameid = ?
  `;

  db.query(query, [gameId], (err, results) => {
    if (err) {
      console.error('DB Error:', err);
      return res.status(500).json({ error: 'Database error', details: err.message });
    }
    res.json(results);
  });
});

// **This** must export the router **directly**:
module.exports = router;

