const { Router } = require('express');
const ctrl = require('./films.controller');
const { authenticate, requireRole } = require('../../middleware/auth');
const validate = require('../../middleware/validate');
const { createFilmSchema } = require('@cinema/shared');

const router = Router();

router.get('/', ctrl.list);
router.post('/', authenticate, requireRole('ADMIN'), validate(createFilmSchema), ctrl.create);
router.delete('/:id', authenticate, requireRole('ADMIN'), ctrl.remove);

module.exports = router;
