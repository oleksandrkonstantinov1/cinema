const { Router } = require('express');
const { registerHandler, loginHandler } = require('./auth.controller');
const validate = require('../../middleware/validate');
const { registerSchema, loginSchema } = require('@cinema/shared');

const router = Router();

router.post('/register', validate(registerSchema), registerHandler);
router.post('/login', validate(loginSchema), loginHandler);

module.exports = router;
