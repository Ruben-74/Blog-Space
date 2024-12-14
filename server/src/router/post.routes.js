import express from "express";
import { create_post, update_post, delete_post } from "../controller/post.js";
import {
  home_view,
  post_view,
  filter_posts,
  automobile_view,
  aero_view,
} from "../controller/view.js";
import withAdminAuth from "../../middlewares/withAdminAuth.js";
import { uploadImage } from "../../middlewares/uploads.js";

const router = express.Router();

// GET (All) Obtenir tous les posts
router.get("/all", home_view);

router.get("/automobile", automobile_view);

router.get("/aero", aero_view);

// Obtenir un post par son ID  GET (READ)
router.get("/:id", post_view);

// Obtenir les posts selon le terme de recherche
router.get("/search/:title", filter_posts);

// CREATE (POST)
router.post("/create", uploadImage, withAdminAuth, create_post);

// UPDATE (PATCH)
router.patch("/update/:id", uploadImage, withAdminAuth, update_post);

// DELETE (DELETE)
router.delete("/remove/:id", withAdminAuth, delete_post);

export default router;
