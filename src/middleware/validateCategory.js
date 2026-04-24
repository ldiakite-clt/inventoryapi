import { body, param } from 'express-validator';
import { checkValidationResults } from './handleValidationErrors.js';

export const validateCreateCategory = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Category name is required')
    .isLength({ min: 1, max: 100 })
    .withMessage('Category name must be between 1 and 100 characters'),
  checkValidationResults,
];

export const validateUpdateCategory = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Valid category ID is required'),
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Category name is required')
    .isLength({ min: 1, max: 100 })
    .withMessage('Category name must be between 1 and 100 characters'),
  checkValidationResults,
];

export const validateCategoryId = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Valid category ID is required'),
  checkValidationResults,
];
