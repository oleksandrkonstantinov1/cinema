const { z } = require('zod');

const hallSchema = z.object({
  name: z.string().min(3),
  address: z.string().min(5),
  city: z.string().min(2),
  capacity: z.number().int().min(1),
});

const createSessionSchema = z
  .object({
    name: z.string().min(3),
    date: z.coerce.date().min(new Date()),
    description: z.string().min(15),
    ticketPrice: z.number().nonnegative(),
    availableTickets: z.number().int().min(1),
    filmId: z.number().int().positive(),
    typeId: z.number().int().positive(),
    hall: hallSchema,
  })
  .refine((d) => d.availableTickets <= d.hall.capacity, {
    message: 'availableTickets cannot exceed hall capacity',
    path: ['availableTickets'],
  });

const updateSessionSchema = z
  .object({
    name: z.string().min(3).optional(),
    date: z.coerce.date().optional(),
    description: z.string().min(15).optional(),
    ticketPrice: z.number().nonnegative().optional(),
    availableTickets: z.number().int().min(1).optional(),
    filmId: z.number().int().positive().optional(),
    typeId: z.number().int().positive().optional(),
    hall: hallSchema.partial().optional(),
  });

module.exports = { createSessionSchema, updateSessionSchema };
