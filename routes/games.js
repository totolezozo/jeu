const express = require('express');
const router = express.Router();
const db = require('../db/connection');

// GET all games
router.get('/', (req, res) => {
  db.query('SELECT * FROM game', (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

// GET single game by ID
router.get('/:id', (req, res) => {
  db.query('SELECT * FROM game WHERE gameid = ?', [req.params.id], (err, results) => {
    if (err) throw err;
    res.json(results[0]);
  });
});

// UPDATE a game
router.put('/:id', (req, res) => {
  const gameId = req.params.id;
  const { title, Description, imageURL } = req.body;
  const sql = 'UPDATE game SET title = ?, Description = ?, imageURL = ? WHERE gameid = ?';
  db.query(sql, [title, Description, imageURL, gameId], (err, result) => {
    if (err) {
      console.error('Update error:', err);
      return res.status(500).send('Error updating game');
    }
    res.send('Game updated successfully');
  });
});

module.exports = router;
