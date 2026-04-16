import express from "express";
import {
  register,
  login,
  getMe,
  refreshTokenHandler,
  logout,
} from "../controllers/auth.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

// Public routes
router.post("/register", register);
router.post("/login",    login);
router.post("/refresh",  refreshTokenHandler);
router.post("/logout",   logout);

// Protected routes
router.get("/getMe", protect, getMe);

export default router;