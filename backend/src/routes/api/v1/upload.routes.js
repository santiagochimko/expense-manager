import { Router } from "express";
import authMiddleware from "../../../middlewares/auth.middleware.js";
import { uploadReceiptImage } from "../../../middlewares/upload.middleware.js";
import { uploadReceipt } from "../../../controllers/upload.controller.js";

const router = Router();

router.use(authMiddleware);

router.post("/receipt", uploadReceiptImage, uploadReceipt);

export default router;