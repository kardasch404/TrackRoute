import { Router } from 'express';
import { TrailerController } from './controllers/trailer.controller';
import { authMiddleware } from '../../shared/middleware/auth.middleware';
import { rbacMiddleware } from '../../shared/middleware/rbac.middleware';
import { validate } from '../../shared/middleware/validation.middleware';
import { Permission } from '../../shared/constants/permissions.constant';
import { createTrailerSchema } from './validators/create-trailer.validator';
import { updateTrailerSchema } from './validators/update-trailer.validator';

const router = Router();
const trailerController = new TrailerController();

router.use(authMiddleware);

router.post('/', rbacMiddleware([Permission.TRAILER_CREATE]), validate(createTrailerSchema), trailerController.createTrailer);
router.get('/', rbacMiddleware([Permission.TRAILER_READ]), trailerController.getAllTrailers);
router.get('/:id', rbacMiddleware([Permission.TRAILER_READ]), trailerController.getTrailerById);
router.put('/:id', rbacMiddleware([Permission.TRAILER_UPDATE]), validate(updateTrailerSchema), trailerController.updateTrailer);
router.delete('/:id', rbacMiddleware([Permission.TRAILER_DELETE]), trailerController.deleteTrailer);

export default router;
