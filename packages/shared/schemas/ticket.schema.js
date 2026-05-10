const { z } = require('zod');

const bookTicketsSchema = z.object({
  sessionId: z.number().int().positive(),
  quantity: z.number().int().min(1).max(10),
});

module.exports = { bookTicketsSchema };
