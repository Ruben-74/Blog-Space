import { Router } from "express";
import post_routes from "./post.routes.js";
import auth_routes from "./auth.routes.js";
import avatar_routes from "./avatar.routes.js";
import user_routes from "./user.routes.js";
import comment_routes from "./comment.routes.js";
import category_routes from "./category.routes.js";
import contact_routes from "./contact.routes.js";
import stats_routes from "./stats.routes.js";
import report_routes from "./report.routes.js";

const router = Router();

// Admin CRUD
router.use("/post", post_routes);

//Authentification
router.use("/auth", auth_routes);

//Avatar
router.use("/avatar", avatar_routes);

//User
router.use("/user", user_routes);

//Comment
router.use("/comment", comment_routes);

//category
router.use("/category", category_routes);

//contact
router.use("/contact", contact_routes);

//Stats
router.use("/stats", stats_routes);

router.use("/report", report_routes);

// GET NOT FOUND (tjr a la fin)
router.get("*", (req, res) => {
  res.status(404).json({ msg: " Page not found" });
});

export default router;
