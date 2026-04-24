import express from 'express';
import * as categoryController from '../controllers/categoryController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { validateCreateCategory, validateUpdateCategory, validateCategoryId } from '../middleware/validateCategory.js';

const router = express.Router();

router.get('/', categoryController.getAllCategories);
router.get('/:id', validateCategoryId, categoryController.getCategoryById);
router.post('/', authenticate, validateCreateCategory, categoryController.createCategory);
router.put('/:id', authenticate, validateUpdateCategory, categoryController.updateCategory);
router.delete('/:id', authenticate, validateCategoryId, categoryController.deleteCategory);

export default router;
