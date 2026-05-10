const { register, login } = require('./auth.service');

async function registerHandler(req, res, next) {
  try {
    const result = await register(req.body);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
}

async function loginHandler(req, res, next) {
  try {
    const result = await login(req.body);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

module.exports = { registerHandler, loginHandler };
