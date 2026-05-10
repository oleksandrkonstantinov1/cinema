const prisma = require('../../lib/prisma');

async function getAllCountries() {
  return prisma.country.findMany({ orderBy: { name: 'asc' } });
}

module.exports = { getAllCountries };
