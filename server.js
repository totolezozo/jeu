// server.js
const express       = require('express');
const cors          = require('cors');
const session       = require('express-session');
const path          = require('path');

const app  = express();
const port = 3000;

const allowedOrigins = [
  'http://localhost:3000',      // if you ever browse from here
  'http://127.0.0.1:5500',      // your Live-Server origin
  'http://localhost:5500'       // just in case
];

// CORS: allow both your front-end origin (if different) and cookies
app.use(cors({
  origin: allowedOrigins, 
  credentials: true
}));
// also handle preflight on every route:
app.options('*', cors({
  origin: allowedOrigins,
  credentials: true
}));

// JSON bodies & sessions
app.use(express.json());
app.use(session({
  secret: 'YO POTO C SECRET',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false,         // keep false for localhost (must be true on HTTPS)
    sameSite: 'lax'        // this enables cookie on redirect!
  }
}));


// Serve all of public/
app.use(express.static(path.join(__dirname, 'public')));

// Auth routes
const authRouter = require('./routes/auth');
app.use('/api/auth', authRouter);

// Your existing API routers
const unwrap = mod => {
  if (typeof mod === 'function')        return mod;
  if (typeof mod.default === 'function') return mod.default;
  if (typeof mod.router === 'function')  return mod.router;
  throw new Error('Expected an Express router');
};

app.use('/api/games',       unwrap(require('./routes/games')));
app.use('/api/reviews',     unwrap(require('./routes/review')));
app.use('/api/best-sellers',unwrap(require('./routes/bestSellers')));
app.use('/api/rent',        unwrap(require('./routes/rent')));

// Fallback 404
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
