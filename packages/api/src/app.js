const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { NODE_ENV } = require('./config/env');
const errorHandler = require('./middleware/errorHandler');

const authRouter = require('./modules/auth/auth.router');
const sessionsRouter = require('./modules/sessions/sessions.router');
const filmsRouter = require('./modules/films/films.router');
const ticketsRouter = require('./modules/tickets/tickets.router');
const categoriesRouter = require('./modules/categories/categories.router');
const countriesRouter = require('./modules/countries/countries.router');
const usersRouter = require('./modules/users/users.router');
const sessionTypesRouter = require('./modules/session-types/session-types.router');

const app = express();

app.use(helmet());
app.use(cors({
  origin: NODE_ENV === 'production'
    ? 'https://your-app.netlify.app'
    : 'http://localhost:5173',
  credentials: true,
}));
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
