const { Router } = require('express');
const ctrl = require('./users.controller');
const { authenticate } = require('../../middleware/auth');

const router = Router();
router.get('/me', authenticate, ctrl.getMe);

module.exports = router;
