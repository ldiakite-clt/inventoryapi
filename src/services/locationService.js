import * as locationRepo from '../repositories/locationRepo.js';
import prisma from '../config/db.js';

export async function getAllLocations() {
  return locationRepo.findAll();
}

export async function getLocationById(id) {
  const location = await locationRepo.findById(id);
  if (!location) {
    const error = new Error('Location not found');
    error.status = 404;
    throw error;
  }
  return location;
}

export async function createLocation(userId, data) {
  return locationRepo.create({
    ...data,
    userId,
  });
}

export async function updateLocation(id, userId, data) {
  const location = await locationRepo.findById(id);
  if (!location) {
    const error = new Error('Location not found');
    error.status = 404;
    throw error;
  }

  if (location.userId !== userId) {
    const error = new Error('Forbidden: You do not have permission to modify this location');
    error.status = 403;
    throw error;
  }

  return locationRepo.update(id, data);
}

export async function deleteLocation(id, userId) {
  const location = await locationRepo.findById(id);
  if (!location) {
    const error = new Error('Location not found');
    error.status = 404;
    throw error;
  }

  if (location.userId !== userId) {
    const error = new Error('Forbidden: You do not have permission to delete this location');
    error.status = 403;
    throw error;
  }

  // Check if items are still assigned to this location
  const itemsCount = await prisma.item.count({
    where: { locationId: id },
  });

  if (itemsCount > 0) {
    const error = new Error('Cannot delete location with items assigned to it');
    error.status = 409;
    throw error;
  }

  return locationRepo.remove(id);
}
