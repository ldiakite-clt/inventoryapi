import * as categoryService from '../services/categoryService.js';

export async function getAllCategories(req, res, next) {
  try {
    const categories = await categoryService.getAllCategories();
    res.json(categories);
  } catch (error) {
    next(error);
  }
}

export async function getCategoryById(req, res, next) {
  try {
    const { id } = req.params;
    const category = await categoryService.getCategoryById(parseInt(id));
    res.json(category);
  } catch (error) {
    next(error);
  }
}

export async function createCategory(req, res, next) {
  try {
    const { name } = req.body;
    const category = await categoryService.createCategory(req.user.userId, { name });
    res.status(201).json(category);
  } catch (error) {
    next(error);
  }
}

export async function updateCategory(req, res, next) {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const category = await categoryService.updateCategory(parseInt(id), req.user.userId, { name });
    res.json(category);
  } catch (error) {
    next(error);
  }
}

export async function deleteCategory(req, res, next) {
  try {
    const { id } = req.params;
    await categoryService.deleteCategory(parseInt(id), req.user.userId);
    res.status(204).end();
  } catch (error) {
    next(error);
  }
}
