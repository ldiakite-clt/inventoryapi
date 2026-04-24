import { body, param } from 'express-validator';
import { checkValidationResults } from './handleValidationErrors.js';

export const validateCreateLocation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Location name is required')
    .isLength({ min: 1, max: 100 })
    .withMessage('Location name must be between 1 and 100 characters'),
  checkValidationResults,
];

export const validateUpdateLocation = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Valid location ID is required'),
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Location name is required')
    .isLength({ min: 1, max: 100 })
    .withMessage('Location name must be between 1 and 100 characters'),
  checkValidationResults,
];

export const validateLocationId = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Valid location ID is required'),
  checkValidationResults,
];
