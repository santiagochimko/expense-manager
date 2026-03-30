import { Router } from 'express';
import authMiddleware from '../../../middlewares/auth.middleware.js';
import { getMe } from '../../../controllers/users.controller.js';

const router = Router();

router.use(authMiddleware);

//Endpoint para que el front sepa quien esta logeado

router.get('/me', getMe);

export default router;