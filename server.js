// server.js
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const path = require('path');

const app = express();
const port = 3000;

// only allow these origins
const allowedOrigins = [
  'http://localhost:3000',
  'http://127.0.0.1:5500',
  'http://localhost:5500'
];

// allow front to talk to back and send cookies
app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

// handle preflight CORS
app.options('*', cors({
  origin: allowedOrigins,
  credentials: true
}));

// use JSON and sessions
app.use(express.json());
app.use(session({
  secret: 'YO POTO C SECRET',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false, // stay false for local dev
    sameSite: 'lax' // needed so login cookie works
  }
}));

// make files in public/ available
app.use(express.static(path.join(__dirname, 'public')));

// routes for login/register/status
const authRouter = require('./routes/auth');
app.use('/api/auth', authRouter);

// other API routes
const unwrap = mod => {
  if (typeof mod === 'function') return mod;
  if (typeof mod.default === 'function') return mod.default;
  if (typeof mod.router === 'function') return mod.router;
  throw new Error('Expected an Express router');
};

app.use('/api/games', unwrap(require('./routes/games')));
app.use('/api/reviews', unwrap(require('./routes/review')));
app.use('/api/best-sellers', unwrap(require('./routes/bestSellers')));
app.use('/api/rent', unwrap(require('./routes/rent')));

// show error if no route matched
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
