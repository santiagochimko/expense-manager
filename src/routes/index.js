import { Router } from "express";
import v1Routes from "./api/v1/index.js";

const router = Router();

//Version 1 API routes
//Proximas versiones se agregan aqui
router.use("/v1", v1Routes);

export default router;