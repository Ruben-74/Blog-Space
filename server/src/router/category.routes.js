import Router from "express";

import {
  create,
  getAll,
  getById,
  remove,
  update,
} from "../controller/category.js";
import withAdminAuth from "../../middlewares/withAdminAuth.js";

const router = Router();

//Vues
router.get("/list", getAll);
router.get("/:id", getById);

// CREATE (POST)
router.post("/create", withAdminAuth, create);

// // UPDATE (PATCH)
router.patch("/update/:id", withAdminAuth, update);

// // DELETE (DELETE)
router.delete("/remove/:id", withAdminAuth, remove);

export default router;
