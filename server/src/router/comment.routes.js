import Router from "express";

import {
  findAllFromID,
  getAll,
  create,
  update,
  remove,
} from "../controller/comment.js";

const router = Router();

router.get("/all", getAll);
router.get("/:id", findAllFromID);

router.post("/create", create);
router.patch("/update/:id", update);
router.delete("/remove/:id", remove);

export default router;
