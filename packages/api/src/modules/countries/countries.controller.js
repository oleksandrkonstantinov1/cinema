const svc = require('./countries.service');

async function list(req, res, next) {
  try {
    res.json(await svc.getAllCountries());
  } catch (err) { next(err); }
}

module.exports = { list };
