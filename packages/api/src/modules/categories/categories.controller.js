const svc = require('./categories.service');

async function list(req, res, next) {
  try {
    res.json(await svc.getAllCategories());
  } catch (err) { next(err); }
}

module.exports = { list };
