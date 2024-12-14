import { Router } from "express";
import {
  create_user,
  getAll,
  remove_user,
  update_user,
  updateAvatar,
  toggleUserStatus, // Importez votre nouvelle méthode ici
} from "../controller/user.js";
import withAuth from "../../middlewares/withAuth.js";
import withAdminAuth from "../../middlewares/withAdminAuth.js";

const router = Router();

router.get("/list", getAll);

// CREATE (POST)
router.post("/create", withAdminAuth, create_user);

// UPDATE (PATCH)
router.patch("/update/:id", withAdminAuth, update_user);

// DELETE (DELETE)
router.delete("/remove/:id", withAdminAuth, remove_user);

// Avatar Update
router.patch("/avatar/:avatar_id", withAuth, updateAvatar);

// Toggle user active status
router.patch("/toggle/:id", withAdminAuth, toggleUserStatus); // Nouvelle route pour activer/désactiver

export default router;
