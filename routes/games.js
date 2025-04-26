const express = require('express');
const router = express.Router();
const db = require('../db/connection');

router.get('/', (req, res) => {
  const query = `
    SELECT 
      g.gameid,
      g.title,
      g.Description,
      g.imageURL,
      g.yearOfPublication,  -- 🆕 add this
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
      yearOfPublication: parseInt(row.yearOfPublication), // 🆕 map it
      minPlayers: parseInt(row.minplayers),
      maxPlayers: parseInt(row.maxplayers),
      minTime: parseInt(row.minplaytime),
      maxTime: parseInt(row.maxplaytime),
      categories: row.categories ? row.categories.split(',') : []
    }));

    res.json(games);
  });
});


module.exports = router;
