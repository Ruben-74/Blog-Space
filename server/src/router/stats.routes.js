import { Router } from "express";
import { getAllStats } from "../controller/stats.js";
import withAdminAuth from "../../middlewares/withAdminAuth.js";

const router = Router();

router.get("/all", withAdminAuth, getAllStats);

export default router;
