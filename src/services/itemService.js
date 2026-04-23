import * as itemRepo from '../repositories/itemRepo.js';

export async function getAllItems() {
  return itemRepo.findAll();
}

export async function getItemById(id) {
  const item = await itemRepo.findById(id);
  if (!item) {
    const error = new Error('Item not found');
    error.status = 404;
    throw error;
  }
  return item;
}

export async function createItem(data, userId) {
  return itemRepo.create({ ...data, userId });
}

export async function updateItem(id, data, userId) {
  const item = await itemRepo.findById(id);
  
  if (!item) {
    const error = new Error('Item not found');
    error.status = 404;
    throw error;
  }
  
  // Ownership-based authorization logic
  if (item.userId !== userId) {
    const error = new Error('Forbidden: You do not own this item');
    error.status = 403;
    throw error;
  }
  
  return itemRepo.update(id, data);
}

export async function deleteItem(id, userId) {
  const item = await itemRepo.findById(id);
  
  if (!item) {
    const error = new Error('Item not found');
    error.status = 404;
    throw error;
  }
  
  // Ownership-based authorization logic
  if (item.userId !== userId) {
    const error = new Error('Forbidden: You do not own this item');
    error.status = 403;
    throw error;
  }
  
  return itemRepo.remove(id);
}