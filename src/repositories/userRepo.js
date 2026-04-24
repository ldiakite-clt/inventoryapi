import prisma from '../config/db.js';

export async function findByEmail(email) {
  return prisma.user.findUnique({ where: { email } });
}

export async function create(data) {
  return prisma.user.create({
    data,
    select: {
      id: true,
      email: true,
      role: true,
    },
  });
}

export async function findById(id) {
  return prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      role: true,
    },
  });
}

export async function findByIdWithPassword(id) {
  return prisma.user.findUnique({
    where: { id },
  });
}

export async function update(id, data) {
  return prisma.user.update({ where: { id }, data });
}

export async function remove(id) {
  return prisma.user.delete({ where: { id } });
}