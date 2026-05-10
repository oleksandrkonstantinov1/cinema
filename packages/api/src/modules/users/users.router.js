const { Router } = require('express');
const ctrl = require('./users.controller');
const { authenticate } = require('../../middleware/auth');
const validate = require('../../middleware/validate');
const { updateMeSchema } = require('@cinema/shared');

const router = Router();
router.get('/me', authenticate, ctrl.getMe);
router.patch('/me', authenticate, validate(updateMeSchema), ctrl.updateMe);

module.exports = router;
