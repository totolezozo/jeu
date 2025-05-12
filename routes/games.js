// routes/games.js
const express = require('express');
const router = express.Router();
const db = require('../db/connection');

// Get all games
router.get('/', (req, res) => {
  const query = `
    SELECT 
      g.gameid,
      g.title,
      g.Description,
      g.imageURL,
      g.yearOfPublication,
      g.minplayers,
      g.maxplayers,
      g.minplaytime,
      g.maxplaytime,
      GROUP_CONCAT(DISTINCT cn.CategoryName) AS categories
    FROM game g
    LEFT JOIN Categorized cz ON g.gameid = cz.gameid
    LEFT JOIN categorieName cn ON cz.categorieId = cn.categorieId
    GROUP BY g.gameid
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('DB Error:', err);
      return res.status(500).json({ error: 'Database error', details: err.message });
    }

    const games = results.map(row => ({
      gameid: row.gameid,
      title: row.title,
      Description: row.Description,
      imageURL: row.imageURL,
      yearOfPublication: row.yearOfPublication,
      minPlayers: row.minplayers,
      maxPlayers: row.maxplayers,
      minTime: row.minplaytime,
      maxTime: row.maxplaytime,
      categories: row.categories ? row.categories.split(',') : []
    }));

    res.json(games);
  });
});

// Get one game by ID
router.get('/:id', (req, res) => {
  const gameId = req.params.id;
  const query = `
    SELECT 
      g.gameid,
      g.title,
      g.Description,
      g.imageURL,
      g.yearOfPublication,
      g.minplayers,
      g.maxplayers,
      g.minplaytime,
      g.maxplaytime,
      GROUP_CONCAT(DISTINCT cn.CategoryName) AS categories
    FROM game g
    LEFT JOIN Categorized cz ON g.gameid = cz.gameid
    LEFT JOIN categorieName cn ON cz.categorieId = cn.categorieId
    WHERE g.gameid = ?
    GROUP BY g.gameid
  `;

  db.query(query, [gameId], (err, results) => {
    if (err) {
      console.error('DB Error:', err);
      return res.status(500).json({ error: 'Database error', details: err.message });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: 'Game not found' });
    }

    const row = results[0];
    const game = {
      gameid: row.gameid,
      title: row.title,
      Description: row.Description,
      imageURL: row.imageURL,
      yearOfPublication: row.yearOfPublication,
      minPlayers: row.minplayers,
      maxPlayers: row.maxplayers,
      minTime: row.minplaytime,
      maxTime: row.maxplaytime,
      categories: row.categories ? row.categories.split(',') : []
    };

    res.json(game);
  });
});

module.exports = router;
