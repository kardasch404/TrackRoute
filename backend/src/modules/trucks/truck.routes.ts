import { Router } from 'express';
import { TruckController } from './controllers/truck.controller';
import { authMiddleware } from '../../shared/middleware/auth.middleware';
import { rbacMiddleware } from '../../shared/middleware/rbac.middleware';
import { validate } from '../../shared/middleware/validation.middleware';
import { Permission } from '../../shared/constants/permissions.constant';
import { createTruckSchema } from './validators/create-truck.validator';
import { updateTruckSchema } from './validators/update-truck.validator';

const router = Router();
const truckController = new TruckController();

router.use(authMiddleware);

router.post('/', rbacMiddleware([Permission.TRUCK_CREATE]), validate(createTruckSchema), truckController.createTruck);
router.get('/', rbacMiddleware([Permission.TRUCK_READ]), truckController.getAllTrucks);
router.get('/:id', rbacMiddleware([Permission.TRUCK_READ]), truckController.getTruckById);
router.put('/:id', rbacMiddleware([Permission.TRUCK_UPDATE]), validate(updateTruckSchema), truckController.updateTruck);
router.delete('/:id', rbacMiddleware([Permission.TRUCK_DELETE]), truckController.deleteTruck);

export default router;
