const svc = require('./tickets.service');

async function book(req, res, next) {
  try {
    const tickets = await svc.bookTickets({
      ...req.body,
      userId: req.user.id,
    });
    res.status(201).json(tickets);
  } catch (err) { next(err); }
}

async function getMe(req, res, next) {
  try {
    res.json(await svc.getMyTickets(req.user.id));
  } catch (err) { next(err); }
}

module.exports = { book, getMe };
