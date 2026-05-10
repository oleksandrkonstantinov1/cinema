// ESM entry for the UI (Vite/Rollup).
// CJS entry (index.js) is used by the API.
// Keep both in sync when schemas change.
import { z } from 'zod';

// ── Auth ──────────────────────────────────────────────
export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

// ── Session ───────────────────────────────────────────
const hallSchema = z.object({
  name: z.string().min(3),
  address: z.string().min(5),
  city: z.string().min(2),
  capacity: z.number().int().min(1),
});

export const createSessionSchema = z
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

export const updateSessionSchema = z.object({
  name: z.string().min(3).optional(),
  date: z.coerce.date().optional(),
  description: z.string().min(15).optional(),
  ticketPrice: z.number().nonnegative().optional(),
  availableTickets: z.number().int().min(1).optional(),
  filmId: z.number().int().positive().optional(),
  typeId: z.number().int().positive().optional(),
  hall: hallSchema.partial().optional(),
});

// ── Film ──────────────────────────────────────────────
export const createFilmSchema = z.object({
  name: z.string().min(1),
  releaseDate: z.coerce.date(),
  categoryId: z.number().int().positive(),
  countryId: z.number().int().positive(),
});

// ── Ticket ────────────────────────────────────────────
export const bookTicketsSchema = z.object({
  sessionId: z.number().int().positive(),
  quantity: z.number().int().min(1).max(10),
});
