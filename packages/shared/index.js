const { registerSchema, loginSchema, updateMeSchema } = require('./schemas/auth.schema');
const { createSessionSchema, updateSessionSchema } = require('./schemas/session.schema');
const { createFilmSchema } = require('./schemas/film.schema');
const { bookTicketsSchema } = require('./schemas/ticket.schema');

module.exports = {
  registerSchema,
  loginSchema,
  updateMeSchema,
  createSessionSchema,
  updateSessionSchema,
  createFilmSchema,
  bookTicketsSchema,
};
