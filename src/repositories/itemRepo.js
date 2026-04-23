import prisma from '../config/db.js';

export async function findAll() {
  return prisma.item.findMany();
}

export async function findById(id) {
  return prisma.item.findUnique({ where: { id } });
}

export async function create(data) {
  return prisma.item.create({ data });
}

export async function update(id, data) {
  return prisma.item.update({ where: { id }, data });
}

export async function remove(id) {
  return prisma.item.delete({ where: { id } });
}