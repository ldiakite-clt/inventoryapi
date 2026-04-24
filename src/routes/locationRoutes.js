import express from 'express';
import * as locationController from '../controllers/locationController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { validateCreateLocation, validateUpdateLocation, validateLocationId } from '../middleware/validateLocation.js';

const router = express.Router();

router.get('/', locationController.getAllLocations);
router.get('/:id', validateLocationId, locationController.getLocationById);
router.post('/', authenticate, validateCreateLocation, locationController.createLocation);
router.put('/:id', authenticate, validateUpdateLocation, locationController.updateLocation);
router.delete('/:id', authenticate, validateLocationId, locationController.deleteLocation);

export default router;
