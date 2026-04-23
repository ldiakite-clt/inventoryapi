import prisma from '../config/db.js';

export async function getAllItems(req, res, next) {
  try {
    const items = await prisma.item.findMany();
    res.json(items);
  } catch (error) {
    next(error);
  }
}

export async function getItemById(req, res, next) {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id) || id <= 0) return res.status(400).json({ error: 'Invalid ID' });

    const item = await prisma.item.findUnique({ where: { id } });
    if (!item) return res.status(404).json({ error: 'Not found' });

    res.json(item);
  } catch (error) {
    next(error);
  }
}

export async function createItem(req, res, next) {
  try {
    const { name, description, quantity, categoryId, locationId } = req.body;
    
    const item = await prisma.item.create({
      data: {
        name,
        description,
        quantity: quantity || 1,
        categoryId: parseInt(categoryId),
        locationId: parseInt(locationId),
        userId: req.user.userId
      }
    });
    
    res.status(201).json(item);
  } catch (error) {
    next(error);
  }
}

export async function updateItem(req, res, next) {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id) || id <= 0) return res.status(400).json({ error: 'Invalid ID' });

    const item = await prisma.item.findUnique({ where: { id } });
    if (!item) return res.status(404).json({ error: 'Not found' });

    if (item.userId !== req.user.userId) {
      return res.status(403).json({ error: 'Forbidden: You do not own this item' });
    }

    const { name, description, quantity, categoryId, locationId } = req.body;
    
    const updatedItem = await prisma.item.update({
      where: { id },
      data: {
        name,
        description,
        quantity,
        categoryId: categoryId ? parseInt(categoryId) : undefined,
        locationId: locationId ? parseInt(locationId) : undefined
      }
    });
    
    res.json(updatedItem);
  } catch (error) {
    next(error);
  }
}

export async function deleteItem(req, res, next) {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id) || id <= 0) return res.status(400).json({ error: 'Invalid ID' });

    const item = await prisma.item.findUnique({ where: { id } });
    if (!item) return res.status(404).json({ error: 'Not found' });

    if (item.userId !== req.user.userId) {
      return res.status(403).json({ error: 'Forbidden: You do not own this item' });
    }

    await prisma.item.delete({ where: { id } });
    
    res.status(204).end();
  } catch (error) {
    next(error);
  }
}