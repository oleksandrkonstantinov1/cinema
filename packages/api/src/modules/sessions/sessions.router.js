const { Router } = require('express');
const ctrl = require('./sessions.controller');
const { authenticate, requireRole } = require('../../middleware/auth');
const validate = require('../../middleware/validate');
const { createSessionSchema, updateSessionSchema } = require('@cinema/shared');

const router = Router();

router.get('/', ctrl.list);
router.get('/:id', ctrl.getOne);
router.post('/', authenticate, requireRole('ADMIN'), validate(createSessionSchema), ctrl.create);
router.put('/:id', authenticate, requireRole('ADMIN'), validate(updateSessionSchema), ctrl.update);
router.delete('/:id', authenticate, requireRole('ADMIN'), ctrl.remove);

module.exports = router;
