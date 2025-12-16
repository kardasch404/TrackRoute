import { Router } from 'express';
import { TripController } from './controllers/trip.controller';
import { authMiddleware } from '../../shared/middleware/auth.middleware';
import { rbacMiddleware } from '../../shared/middleware/rbac.middleware';
import { validate } from '../../shared/middleware/validation.middleware';
import { Permission } from '../../shared/constants/permissions.constant';
import { createTripSchema } from './validators/create-trip.validator';
import { updateStatusSchema } from './validators/update-status.validator';

const router = Router();
const tripController = new TripController();

// All routes require authentication
router.use(authMiddleware);

// Admin only: Create trip (assign to driver)
router.post(
  '/',
  rbacMiddleware([Permission.TRIP_CREATE]),
  validate(createTripSchema),
  tripController.createTrip
);

// Admin sees all trips, driver sees only their own trips (handled in controller)
router.get(
  '/',
  rbacMiddleware([Permission.TRIP_READ]),
  tripController.getAllTrips
);

// Driver endpoint: Get my trips
router.get(
  '/my-trips',
  tripController.getMyTrips
);

// Get available resources for trip assignment (must be before /:id routes)
router.get(
  '/available/drivers',
  rbacMiddleware([Permission.TRIP_CREATE]),
  tripController.getAvailableDrivers
);

router.get(
  '/available/trucks',
  rbacMiddleware([Permission.TRIP_CREATE]),
  tripController.getAvailableTrucks
);

router.get(
  '/available/trailers',
  rbacMiddleware([Permission.TRIP_CREATE]),
  tripController.getAvailableTrailers
);

// Get trip by ID
router.get(
  '/:id',
  rbacMiddleware([Permission.TRIP_READ]),
  tripController.getTripById
);

// Update trip status (drivers can update their own trips)
router.put(
  '/:id/status',
  validate(updateStatusSchema),
  tripController.updateStatus
);

// Admin only: Full trip update
router.put(
  '/:id',
  rbacMiddleware([Permission.TRIP_UPDATE]),
  tripController.updateTrip
);

// Admin only: Calculate trip cost
router.post(
  '/:id/calculate-cost',
  rbacMiddleware([Permission.TRIP_READ]),
  tripController.calculateTripCost
);

// Admin only: Delete trip
router.delete(
  '/:id',
  rbacMiddleware([Permission.TRIP_DELETE]),
  tripController.deleteTrip
);

export default router;
