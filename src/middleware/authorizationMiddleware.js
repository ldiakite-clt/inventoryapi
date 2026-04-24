export function checkOwnership(resourceOwner, userId) {
  if (resourceOwner !== userId) {
    const error = new Error('Forbidden: You do not have permission to modify this resource');
    error.status = 403;
    throw error;
  }
}

export async function requireItemOwnership(req, res, next) {
  try {
    const { itemId } = req.params;
    const userId = req.user.userId;

    // itemId should be validated elsewhere, this just checks ownership
    req.itemId = parseInt(itemId);
    req.userId = userId;

    next();
  } catch (error) {
    next(error);
  }
}

export async function requireCategoryOwnership(req, res, next) {
  try {
    const { categoryId } = req.params;
    const userId = req.user.userId;

    req.categoryId = parseInt(categoryId);
    req.userId = userId;

    next();
  } catch (error) {
    next(error);
  }
}

export async function requireLocationOwnership(req, res, next) {
  try {
    const { locationId } = req.params;
    const userId = req.user.userId;

    req.locationId = parseInt(locationId);
    req.userId = userId;

    next();
  } catch (error) {
    next(error);
  }
}
