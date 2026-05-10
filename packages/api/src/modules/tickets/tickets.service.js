const prisma = require('../../lib/prisma');
const { AppError } = require('../../lib/errors');

async function bookTickets({ sessionId, userId, quantity }) {
  return prisma.$transaction(async (tx) => {
    const session = await tx.session.findUniqueOrThrow({
      where: { id: sessionId },
      select: { availableTickets: true },
    });

    if (session.availableTickets < quantity) {
      throw new AppError(`Only ${session.availableTickets} tickets available`, 409);
    }

    const tickets = await Promise.all(
      Array.from({ length: quantity }, () =>
        tx.ticket.create({ data: { sessionId, userId, status: 'BOOKED' } })
      )
    );

    await tx.session.update({
      where: { id: sessionId },
      data: { availableTickets: { decrement: quantity } },
    });

    return tickets;
  });
}

async function getMyTickets(userId) {
  return prisma.ticket.findMany({
    where: { userId },
    include: {
      session: {
        include: { film: true, hall: true, type: true },
      },
    },
    orderBy: { purchaseDate: 'desc' },
  });
}

module.exports = { bookTickets, getMyTickets };
