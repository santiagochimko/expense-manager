import { Router } from 'express';
import authMiddleware from '../../../middlewares/auth.middleware.js';
import { getMe } from '../../../controllers/users.controller.js';
import validate from '../../../middlewares/validate.middleware.js';
import { updatePlan } from '../../../controllers/users.controller.js';
import { updatePlanSchema } from '../../../validations/user.validation.js';

const router = Router();

router.use(authMiddleware);

//Endpoint para que el front sepa quien esta logeado

router.get('/me', getMe);
router.patch('/me/plan', validate(updatePlanSchema), updatePlan);

export default router;