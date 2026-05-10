const { z } = require('zod');

const createFilmSchema = z.object({
  name: z.string().min(1),
  releaseDate: z.coerce.date(),
  categoryId: z.number().int().positive(),
  countryId: z.number().int().positive(),
});

module.exports = { createFilmSchema };
