import { body, param, query } from 'express-validator';
import { checkValidationResults } from './handleValidationErrors.js';

export const validateCreateItem = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Item name is required')
    .isLength({ min: 1, max: 255 })
    .withMessage('Item name must be between 1 and 255 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Description must not exceed 1000 characters'),
  body('quantity')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Quantity must be a positive integer'),
  body('categoryId')
    .isInt({ min: 1 })
    .withMessage('Valid categoryId is required'),
  body('locationId')
    .isInt({ min: 1 })
    .withMessage('Valid locationId is required'),
  checkValidationResults,
];

export const validateUpdateItem = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Valid item ID is required'),
  body('name')
    .optional()
    .trim()
    .isLength({ min: 1, max: 255 })
    .withMessage('Item name must be between 1 and 255 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Description must not exceed 1000 characters'),
  body('quantity')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Quantity must be a positive integer'),
  body('categoryId')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Valid categoryId is required'),
  body('locationId')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Valid locationId is required'),
  checkValidationResults,
];

export const validateItemId = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Valid item ID is required'),
  checkValidationResults,
];

export const validateItemQuery = [
  query('search')
    .optional()
    .trim()
    .isLength({ max: 255 })
    .withMessage('Search term must not exceed 255 characters'),
  query('sort')
    .optional()
    .trim()
    .matches(/^(name|quantity|createdAt):(asc|desc)$/)
    .withMessage('Sort must be in format "field:asc" or "field:desc"'),
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  checkValidationResults,
];
