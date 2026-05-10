const prisma = require('../../lib/prisma');

async function getAllCategories() {
  return prisma.category.findMany({ orderBy: { name: 'asc' } });
}

module.exports = { getAllCategories };
