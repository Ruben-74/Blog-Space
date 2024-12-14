import express from "express";
import { check_auth, login, logout, register } from "../controller/auth.js";

const router = express.Router();

//POST
router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

router.get("/check-auth", check_auth);

export default router;
