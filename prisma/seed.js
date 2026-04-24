import 'dotenv/config';
import bcrypt from 'bcrypt';
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

  const isDev = !process.env.NODE_ENV || process.env.NODE_ENV === 'development';

  // Clean up existing data in development
  if (isDev) {
    console.log('Development mode: truncating tables...');
    await prisma.item.deleteMany();
    await prisma.location.deleteMany();
    await prisma.category.deleteMany();
    await prisma.user.deleteMany();
  }

  // Check if data already exists
  const userCount = await prisma.user.count();
  if (userCount > 0) {
    console.log('Database already has users. Skipping seed.');
    return;
  }

  // Hash passwords
  const password1Hash = await bcrypt.hash('Password123!', 10);
  const password2Hash = await bcrypt.hash('Password123!', 10);
  const adminPasswordHash = await bcrypt.hash('AdminPass123!', 10);

  // Create sample users
  const user1 = await prisma.user.create({
    data: {
      email: 'owner@example.com',
      password: password1Hash,
      role: 'USER',
    },
  });

  const user2 = await prisma.user.create({
    data: {
      email: 'not-owner@example.com',
      password: password2Hash,
      role: 'USER',
    },
  });

  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@example.com',
      password: adminPasswordHash,
      role: 'ADMIN',
    },
  });

  console.log('Created users:');
  console.log(`  - ${user1.email} (USER)`);
  console.log(`  - ${user2.email} (USER)`);
  console.log(`  - ${adminUser.email} (ADMIN)`);

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

  const furniture = await prisma.category.create({
    data: {
      name: 'Furniture',
      userId: user1.id,
    },
  });

  // Create categories for user2
  const kitchenSupplies = await prisma.category.create({
    data: {
      name: 'Kitchen Supplies',
      userId: user2.id,
    },
  });

  console.log('Created categories:');
  console.log(`  - Electronics (owner: ${user1.email})`);
  console.log(`  - Tools (owner: ${user1.email})`);
  console.log(`  - Furniture (owner: ${user1.email})`);
  console.log(`  - Kitchen Supplies (owner: ${user2.email})`);

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

  const bedroom = await prisma.location.create({
    data: {
      name: 'Bedroom Closet',
      userId: user1.id,
    },
  });

  // Create locations for user2
  const kitchen = await prisma.location.create({
    data: {
      name: 'Kitchen Cabinet',
      userId: user2.id,
    },
  });

  console.log('Created locations:');
  console.log(`  - Garage Shelf (owner: ${user1.email})`);
  console.log(`  - Desk Drawer (owner: ${user1.email})`);
  console.log(`  - Bedroom Closet (owner: ${user1.email})`);
  console.log(`  - Kitchen Cabinet (owner: ${user2.email})`);

  // Create items for user1
  const item1 = await prisma.item.create({
    data: {
      name: 'Screwdriver Set',
      description: 'Phillips and flathead, 12-piece',
      quantity: 1,
      userId: user1.id,
      categoryId: tools.id,
      locationId: garage.id,
    },
  });

  const item2 = await prisma.item.create({
    data: {
      name: 'HDMI Cable',
      description: null,
      quantity: 4,
      userId: user1.id,
      categoryId: electronics.id,
      locationId: desk.id,
    },
  });

  const item3 = await prisma.item.create({
    data: {
      name: 'USB-C Hub',
      description: '7-port hub with HDMI out',
      quantity: 1,
      userId: user1.id,
      categoryId: electronics.id,
      locationId: desk.id,
    },
  });

  const item4 = await prisma.item.create({
    data: {
      name: 'Wood Chair',
      description: 'Office chair with armrests',
      quantity: 2,
      userId: user1.id,
      categoryId: furniture.id,
      locationId: bedroom.id,
    },
  });

  // Create items for user2
  const item5 = await prisma.item.create({
    data: {
      name: 'Mixing Bowls',
      description: 'Set of 3 ceramic bowls',
      quantity: 3,
      userId: user2.id,
      categoryId: kitchenSupplies.id,
      locationId: kitchen.id,
    },
  });

  console.log('Created items:');
  console.log(`  - Screwdriver Set (owner: ${user1.email})`);
  console.log(`  - HDMI Cable (owner: ${user1.email})`);
  console.log(`  - USB-C Hub (owner: ${user1.email})`);
  console.log(`  - Wood Chair (owner: ${user1.email})`);
  console.log(`  - Mixing Bowls (owner: ${user2.email})`);

  console.log('\n✅ Database seeded successfully!');
  console.log('\nTest Credentials:');
  console.log('  Owner Account:');
  console.log('    Email: owner@example.com');
  console.log('    Password: Password123!');
  console.log('\n  Non-Owner Account:');
  console.log('    Email: not-owner@example.com');
  console.log('    Password: Password123!');
  console.log('\n  Admin Account:');
  console.log('    Email: admin@example.com');
  console.log('    Password: AdminPass123!');
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
