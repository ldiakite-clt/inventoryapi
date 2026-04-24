import * as locationService from '../services/locationService.js';

export async function getAllLocations(req, res, next) {
  try {
    const locations = await locationService.getAllLocations();
    res.json(locations);
  } catch (error) {
    next(error);
  }
}

export async function getLocationById(req, res, next) {
  try {
    const { id } = req.params;
    const location = await locationService.getLocationById(parseInt(id));
    res.json(location);
  } catch (error) {
    next(error);
  }
}

export async function createLocation(req, res, next) {
  try {
    const { name } = req.body;
    const location = await locationService.createLocation(req.user.userId, { name });
    res.status(201).json(location);
  } catch (error) {
    next(error);
  }
}

export async function updateLocation(req, res, next) {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const location = await locationService.updateLocation(parseInt(id), req.user.userId, { name });
    res.json(location);
  } catch (error) {
    next(error);
  }
}

export async function deleteLocation(req, res, next) {
  try {
    const { id } = req.params;
    await locationService.deleteLocation(parseInt(id), req.user.userId);
    res.status(204).end();
  } catch (error) {
    next(error);
  }
}
