const svc = require('./users.service');

async function getMe(req, res, next) {
  try {
    res.json(await svc.getMe(req.user.id));
  } catch (err) { next(err); }
}

async function updateMe(req, res, next) {
  try {
    res.json(await svc.updateMe(req.user.id, req.body));
  } catch (err) { next(err); }
}

module.exports = { getMe, updateMe };
