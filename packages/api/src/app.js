const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const errorHandler = require('./middleware/errorHandler');

const authRouter = require('./modules/auth/auth.router');
const sessionsRouter = require('./modules/sessions/sessions.router');
const filmsRouter = require('./modules/films/films.router');
const ticketsRouter = require('./modules/tickets/tickets.router');
const categoriesRouter = require('./modules/categories/categories.router');
const countriesRouter = require('./modules/countries/countries.router');
const usersRouter = require('./modules/users/users.router');
const sessionTypesRouter = require('./modules/session-types/session-types.router');

const ALLOWED_ORIGINS = new Set([
  process.env.FRONTEND_URL,          // e.g. https://your-app.netlify.app
  'http://localhost:5173',
  'http://localhost:4173',            // vite preview
].filter(Boolean));

const app = express();

app.use(cors({
  origin(origin, callback) {
    // allow non-browser requests (curl, Render health checks) and known origins
    if (!origin || ALLOWED_ORIGINS.has(origin)) return callback(null, true);
    callback(new Error(`CORS: origin ${origin} not allowed`));
  },
  credentials: true,
}));
app.use(helmet());
app.use(express.json());

app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.use('/api/auth', authRouter);
app.use('/api/sessions', sessionsRouter);
app.use('/api/films', filmsRouter);
app.use('/api/tickets', ticketsRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/countries', countriesRouter);
app.use('/api/users', usersRouter);
app.use('/api/session-types', sessionTypesRouter);

app.use(errorHandler);

module.exports = app;
