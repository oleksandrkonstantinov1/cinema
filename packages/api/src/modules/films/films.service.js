const prisma = require('../../lib/prisma');
const { AppError } = require('../../lib/errors');

const filmInclude = { category: true, country: true };

async function getAllFilms() {
  return prisma.film.findMany({ include: filmInclude, orderBy: { name: 'asc' } });
}

async function createFilm(data) {
  return prisma.film.create({ data, include: filmInclude });
}

async function deleteFilm(id) {
  const film = await prisma.film.findUnique({ where: { id } });
  if (!film) throw new AppError('Film not found', 404);
  return prisma.film.delete({ where: { id } });
}

module.exports = { getAllFilms, createFilm, deleteFilm };
