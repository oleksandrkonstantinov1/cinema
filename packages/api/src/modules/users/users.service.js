const prisma = require('../../lib/prisma');

async function getMe(id) {
  return prisma.user.findUniqueOrThrow({
    where: { id },
    select: { id: true, email: true, role: true, createdAt: true },
  });
}

module.exports = { getMe };
