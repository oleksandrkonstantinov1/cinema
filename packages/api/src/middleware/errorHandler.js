const { AppError } = require('../lib/errors');

// Prisma error codes we care about
const PRISMA_NOT_FOUND = 'P2025';
const PRISMA_UNIQUE     = 'P2002';
const PRISMA_FK         = 'P2003';

function errorHandler(err, req, res, next) {
  // Known application errors — safe to expose message
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ error: err.message });
  }

  // Prisma known request errors
  if (err.code === PRISMA_NOT_FOUND) {
    return res.status(404).json({ error: 'Resource not found' });
  }
  if (err.code === PRISMA_UNIQUE) {
    const field = err.meta?.target?.[0] ?? 'field';
    return res.status(409).json({ error: `${field} already in use` });
  }
  if (err.code === PRISMA_FK) {
    return res.status(409).json({ error: 'Related resource does not exist' });
  }

  // Prisma validation errors (bad data shape reaching the ORM)
  if (err.name === 'PrismaClientValidationError') {
    return res.status(400).json({ error: 'Invalid data provided' });
  }

  // Express body-parser JSON syntax error
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'Invalid JSON body' });
  }

  // Unknown — log full error server-side, never expose internals
  console.error('[unhandled]', err);
  const isProd = process.env.NODE_ENV === 'production';
  res.status(500).json({
    error: 'Internal server error',
    // Only include message in dev so debugging stays fast
    ...(isProd ? {} : { detail: err.message }),
  });
}

module.exports = errorHandler;
