const svc = require('./sessions.service');

async function list(req, res, next) {
  try {
    res.json(await svc.getUpcomingSessions());
  } catch (err) { next(err); }
}

async function getOne(req, res, next) {
  try {
    res.json(await svc.getSessionById(Number(req.params.id)));
  } catch (err) { next(err); }
}

async function create(req, res, next) {
  try {
    res.status(201).json(await svc.createSession(req.body));
  } catch (err) { next(err); }
}

async function update(req, res, next) {
  try {
    res.json(await svc.updateSession(Number(req.params.id), req.body));
  } catch (err) { next(err); }
}

async function remove(req, res, next) {
  try {
    await svc.deleteSession(Number(req.params.id));
    res.status(204).end();
  } catch (err) { next(err); }
}

module.exports = { list, getOne, create, update, remove };
