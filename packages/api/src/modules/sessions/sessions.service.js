const prisma = require('../../lib/prisma');
const { AppError } = require('../../lib/errors');

const sessionInclude = {
  hall: true,
  film: { include: { category: true, country: true } },
  type: true,
};

async function getUpcomingSessions() {
  return prisma.session.findMany({
    where: { date: { gte: new Date() } },
    include: sessionInclude,
    orderBy: { date: 'asc' },
  });
}

async function getSessionById(id) {
  const session = await prisma.session.findUnique({
    where: { id },
    include: sessionInclude,
  });
  if (!session) throw new AppError('Session not found', 404);
  return session;
}

async function createSession(data) {
  const { hall, ...sessionData } = data;
  return prisma.$transaction(async (tx) => {
    const createdHall = await tx.hall.create({ data: hall });
    return tx.session.create({
      data: { ...sessionData, hallId: createdHall.id },
      include: sessionInclude,
    });
  });
}

async function updateSession(id, data) {
  const { hall, ...sessionData } = data;
  return prisma.$transaction(async (tx) => {
    const session = await tx.session.findUniqueOrThrow({ where: { id } });
    if (hall) await tx.hall.update({ where: { id: session.hallId }, data: hall });
    return tx.session.update({
      where: { id },
      data: sessionData,
      include: sessionInclude,
    });
  });
}

async function deleteSession(id) {
  const session = await prisma.session.findUnique({ where: { id } });
  if (!session) throw new AppError('Session not found', 404);
  return prisma.session.delete({ where: { id } });
}

module.exports = { getUpcomingSessions, getSessionById, createSession, updateSession, deleteSession };
