import 'dotenv/config';
import { PrismaClient } from '../src/generated/prisma/client.js';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is not set');
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Seeding database...');

  // Clean up existing data
  await prisma.item.deleteMany();
  await prisma.location.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  // Create sample users
  const user1 = await prisma.user.create({
    data: {
      email: 'john@example.com',
      password: 'hashedpassword123', // In production, this would be hashed
      role: 'USER',
    },
  });

  const user2 = await prisma.user.create({
    data: {
      email: 'admin@example.com',
      password: 'hashedpassword456',
      role: 'ADMIN',
    },
  });

  // Create categories for user1
  const electronics = await prisma.category.create({
    data: {
      name: 'Electronics',
      userId: user1.id,
    },
  });

  const tools = await prisma.category.create({
    data: {
      name: 'Tools',
      userId: user1.id,
    },
  });

  // Create locations for user1
  const garage = await prisma.location.create({
    data: {
      name: 'Garage Shelf',
      userId: user1.id,
    },
  });

  const desk = await prisma.location.create({
    data: {
      name: 'Desk Drawer',
      userId: user1.id,
    },
  });

  // Create items for user1
  await prisma.item.create({
    data: {
      name: 'Laptop',
      description: 'Dell XPS 13',
      quantity: 1,
      userId: user1.id,
      categoryId: electronics.id,
      locationId: desk.id,
    },
  });

  await prisma.item.create({
    data: {
      name: 'Hammer',
      description: 'Claw hammer',
      quantity: 2,
      userId: user1.id,
      categoryId: tools.id,
      locationId: garage.id,
    },
  });

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
