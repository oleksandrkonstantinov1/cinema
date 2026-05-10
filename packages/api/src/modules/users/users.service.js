const bcrypt = require('bcryptjs');
const prisma = require('../../lib/prisma');

async function getMe(id) {
  return prisma.user.findUniqueOrThrow({
    where: { id },
    select: { id: true, email: true, createdAt: true },
  });
}

async function updateMe(id, { email, password }) {
  const data = {};
  if (email) data.email = email;
  if (password) data.password = await bcrypt.hash(password, 12);
  return prisma.user.update({
    where: { id },
    data,
    select: { id: true, email: true, createdAt: true },
  });
}

module.exports = { getMe, updateMe };
