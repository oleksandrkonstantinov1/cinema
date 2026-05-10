const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const categories = await Promise.all(
    ['Action', 'Drama', 'Comedy', 'Horror', 'Sci-Fi', 'Thriller', 'Romance', 'Animation'].map(
      (name) => prisma.category.upsert({ where: { name }, update: {}, create: { name } })
    )
  );
  console.log(`Seeded ${categories.length} categories`);

  const countries = await Promise.all(
    ['USA', 'UK', 'France', 'Germany', 'Japan', 'South Korea', 'India', 'Ukraine'].map(
      (name) => prisma.country.upsert({ where: { name }, update: {}, create: { name } })
    )
  );
  console.log(`Seeded ${countries.length} countries`);

  const sessionTypes = await Promise.all(
    ['Standard', 'IMAX', '3D', 'VIP'].map(
      (name) => prisma.sessionType.upsert({ where: { name }, update: {}, create: { name } })
    )
  );
  console.log(`Seeded ${sessionTypes.length} session types`);

  const passwordHash = await bcrypt.hash('Admin1234!', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@cinema.local' },
    update: {},
    create: {
      email: 'admin@cinema.local',
      passwordHash,
      role: 'ADMIN',
    },
  });
  console.log(`Admin user: ${admin.email}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
