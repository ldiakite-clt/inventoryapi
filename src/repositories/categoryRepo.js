import prisma from '../config/db.js';

export async function findAll(where = {}, skip = 0, take = 10) {
  return prisma.category.findMany({
    where,
    skip,
    take,
    select: {
      id: true,
      name: true,
      createdAt: true,
      userId: true,
    },
  });
}

export async function count(where = {}) {
  return prisma.category.count({ where });
}

export async function findById(id) {
  return prisma.category.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      createdAt: true,
      userId: true,
    },
  });
}

export async function create(data) {
  return prisma.category.create({
    data,
    select: {
      id: true,
      name: true,
      createdAt: true,
      userId: true,
    },
  });
}

export async function update(id, data) {
  return prisma.category.update({
    where: { id },
    data,
    select: {
      id: true,
      name: true,
      createdAt: true,
      userId: true,
    },
  });
}

export async function remove(id) {
  return prisma.category.delete({ where: { id } });
}
