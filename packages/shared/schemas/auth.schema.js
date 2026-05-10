const { z } = require('zod');

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const updateMeSchema = z.object({
  email: z.string().email().optional(),
  password: z.string().min(8, 'Password must be at least 8 characters').optional(),
}).refine((d) => d.email || d.password, { message: 'Provide email or password' });

module.exports = { registerSchema, loginSchema, updateMeSchema };
