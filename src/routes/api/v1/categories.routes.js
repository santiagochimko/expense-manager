import { Router } from 'express';
import authMiddleware from '../../../middlewares/auth.middleware.js';
import validate from "../../../middlewares/validate.middleware.js";
import {
    createCategorySchema,
    updateCategorySchema
} from '../../../validations/category.validation.js';
import {
    create,
    getAll,
    getById,
    update,
    remove
} from '../../../controllers/categories.controller.js';


const router = Router();

//Todas las rutas de categorias son protegidas

router.use(authMiddleware);

router.post("/", validate(createCategorySchema), create);
router.get("/", getAll);
router.get("/:id", getById);
router.patch("/:id", validate(updateCategorySchema), update);
router.delete("/:id", remove);

export default router;