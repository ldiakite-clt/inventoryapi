import express from 'express';
import * as itemController from '../controllers/itemController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', itemController.getAllItems);
router.get('/:id', itemController.getItemById);
router.post('/', authenticate, itemController.createItem);
router.put('/:id', authenticate, itemController.updateItem);
router.delete('/:id', authenticate, itemController.deleteItem);

export default router;