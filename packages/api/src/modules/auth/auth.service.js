const bcrypt = require('bcryptjs');
const prisma = require('../../lib/prisma');
const { signToken } = require('../../lib/jwt');
const { AppError } = require('../../lib/errors');

async function register({ email, password }) {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw new AppError('Email already in use', 409);

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await prisma.user.create({
    data: { email, passwordHash },
    select: { id: true, email: true, role: true },
  });

  return { user, token: signToken(user) };
}

async function login({ email, password }) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new AppError('Invalid credentials', 401);

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) throw new AppError('Invalid credentials', 401);

  const { passwordHash: _, ...safeUser } = user;
  return { user: safeUser, token: signToken(safeUser) };
}

module.exports = { register, login };
