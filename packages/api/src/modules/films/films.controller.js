const svc = require('./films.service');

async function list(req, res, next) {
  try {
    res.json(await svc.getAllFilms());
  } catch (err) { next(err); }
}

async function create(req, res, next) {
  try {
    res.status(201).json(await svc.createFilm(req.body));
  } catch (err) { next(err); }
}

async function remove(req, res, next) {
  try {
    await svc.deleteFilm(Number(req.params.id));
    res.status(204).end();
  } catch (err) { next(err); }
}

module.exports = { list, create, remove };
