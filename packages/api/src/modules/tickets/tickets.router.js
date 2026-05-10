const { Router } = require('express');
const ctrl = require('./tickets.controller');
const { authenticate } = require('../../middleware/auth');
const validate = require('../../middleware/validate');
const { bookTicketsSchema } = require('@cinema/shared');

const router = Router();

router.post('/', authenticate, validate(bookTicketsSchema), ctrl.book);
router.get('/me', authenticate, ctrl.getMe);

module.exports = router;
