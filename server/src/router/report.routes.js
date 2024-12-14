import Router from "express";

import {
  getAllReports,
  createReport,
  updateReportStatus,
  removeReport,
} from "../controller/report.js";
import withAdminAuth from "../../middlewares/withAdminAuth.js";

const router = Router();

router.get("/all", getAllReports);

router.post("/create", createReport);
router.patch("/update/:reportId", withAdminAuth, updateReportStatus);
router.delete("/remove/:id", withAdminAuth, removeReport);

export default router;
