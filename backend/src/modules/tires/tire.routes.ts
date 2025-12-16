import { Router } from 'express';
import { TireController } from './controllers/tire.controller';
import { authMiddleware } from '../../shared/middleware/auth.middleware';
import { rbacMiddleware } from '../../shared/middleware/rbac.middleware';
import { validationMiddleware } from '../../shared/middleware/validation.middleware';
import { Permission } from '../../shared/constants/permissions.constant';
import { createTireSchema } from './validators/create-tire.validator';
import { updateTireSchema } from './validators/update-tire.validator';

const router = Router();
const tireController = new TireController();

router.use(authMiddleware);

router.post('/', rbacMiddleware([Permission.TIRE_CREATE]), validationMiddleware(createTireSchema), tireController.createTire);
router.get('/', rbacMiddleware([Permission.TIRE_READ]), tireController.getAllTires);
router.get('/:id', rbacMiddleware([Permission.TIRE_READ]), tireController.getTireById);
router.put('/:id', rbacMiddleware([Permission.TIRE_UPDATE]), validationMiddleware(updateTireSchema), tireController.updateTire);
router.delete('/:id', rbacMiddleware([Permission.TIRE_DELETE]), tireController.deleteTire);

export default router;
