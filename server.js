const express = require('express');
const cors = require('cors'); // ✅ add this
const app = express();
const PORT = 3000;

app.use(cors()); // ✅ allow all origins by default
app.use(express.json());
app.use(express.static('public'));

app.use('/api/games', require('./routes/games'));
app.use('/api/best-sellers', require('./routes/bestSellers'));

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
