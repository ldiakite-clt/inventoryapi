import * as categoryRepo from '../repositories/categoryRepo.js';
import prisma from '../config/db.js';

export async function getAllCategories() {
  return categoryRepo.findAll();
}

export async function getCategoryById(id) {
  const category = await categoryRepo.findById(id);
  if (!category) {
    const error = new Error('Category not found');
    error.status = 404;
    throw error;
  }
  return category;
}

export async function createCategory(userId, data) {
  return categoryRepo.create({
    ...data,
    userId,
  });
}

export async function updateCategory(id, userId, data) {
  const category = await categoryRepo.findById(id);
  if (!category) {
    const error = new Error('Category not found');
    error.status = 404;
    throw error;
  }

  if (category.userId !== userId) {
    const error = new Error('Forbidden: You do not have permission to modify this category');
    error.status = 403;
    throw error;
  }

  return categoryRepo.update(id, data);
}

export async function deleteCategory(id, userId) {
  const category = await categoryRepo.findById(id);
  if (!category) {
    const error = new Error('Category not found');
    error.status = 404;
    throw error;
  }

  if (category.userId !== userId) {
    const error = new Error('Forbidden: You do not have permission to delete this category');
    error.status = 403;
    throw error;
  }

  // Check if items are still assigned to this category
  const itemsCount = await prisma.item.count({
    where: { categoryId: id },
  });

  if (itemsCount > 0) {
    const error = new Error('Cannot delete category with items assigned to it');
    error.status = 409;
    throw error;
  }

  return categoryRepo.remove(id);
}
