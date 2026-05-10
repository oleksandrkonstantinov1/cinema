const { Router } = require('express');
const ctrl = require('./countries.controller');

const router = Router();
router.get('/', ctrl.list);

module.exports = router;
