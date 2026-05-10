const { Router } = require('express');
const ctrl = require('./categories.controller');

const router = Router();
router.get('/', ctrl.list);

module.exports = router;
