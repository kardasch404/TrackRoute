import { Router } from 'express';
import { TripController } from './controllers/trip.controller';
import { authMiddleware } from '../../shared/middleware/auth.middleware';
import { rbacMiddleware } from '../../shared/middleware/rbac.middleware';
import { validationMiddleware } from '../../shared/middleware/validation.middleware';
import { Permission } from '../../shared/constants/permissions.constant';
import { createTripSchema } from './validators/create-trip.validator';
import { updateStatusSchema } from './validators/update-status.validator';

const router = Router();
const tripController = new TripController();

router.use(authMiddleware);

router.post('/', rbacMiddleware([Permission.TRIP_CREATE]), validationMiddleware(createTripSchema), tripController.createTrip);
router.get('/', rbacMiddleware([Permission.TRIP_READ]), tripController.getAllTrips);
router.get('/:id', rbacMiddleware([Permission.TRIP_READ]), tripController.getTripById);
router.put('/:id', rbacMiddleware([Permission.TRIP_UPDATE]), tripController.updateTrip);
router.patch('/:id/status', rbacMiddleware([Permission.TRIP_UPDATE]), validationMiddleware(updateStatusSchema), tripController.updateStatus);
router.delete('/:id', rbacMiddleware([Permission.TRIP_DELETE]), tripController.deleteTrip);

export default router;
