const { Router } = require('express');
const prisma = require('../../lib/prisma');

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const types = await prisma.sessionType.findMany({ orderBy: { name: 'asc' } });
    res.json(types);
  } catch (err) { next(err); }
});

module.exports = router;
