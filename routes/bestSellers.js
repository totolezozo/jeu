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
      COUNT(r.gameid) AS rent_count,
      GROUP_CONCAT(DISTINCT cn.CategoryName) AS categories
    FROM game g
    JOIN rent r ON g.gameid = r.gameid
    LEFT JOIN Categorized cz ON g.gameid = cz.gameid
    LEFT JOIN categorieName cn ON cz.categorieId = cn.categorieId
    WHERE r.status = 'returned'
    GROUP BY g.gameid
    ORDER BY rent_count DESC
    LIMIT 10
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('DB Error:', err);
      return res.status(500).json({ error: 'Database error', details: err.message });
    }

    const games = results.map(row => ({
      ...row,
      categories: row.categories ? row.categories.split(',') : []
    }));

    res.json(games);
  });
});

module.exports = router;
