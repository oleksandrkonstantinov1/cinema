const { registerSchema, loginSchema } = require('./schemas/auth.schema');
const { createSessionSchema, updateSessionSchema } = require('./schemas/session.schema');
const { createFilmSchema } = require('./schemas/film.schema');
const { bookTicketsSchema } = require('./schemas/ticket.schema');

module.exports = {
  registerSchema,
  loginSchema,
  createSessionSchema,
  updateSessionSchema,
  createFilmSchema,
  bookTicketsSchema,
};
