import express from "express";
import { verifyRole, verifyToken } from "../middleware/authMiddleware.js";
import {
  deleteUser,
  getProfile,
  getUsers,
} from "../controllers/userController.js";

const router = express.Router();

router.get("/", verifyToken, verifyRole("admin"), getUsers);
router.get("/me", verifyToken, getProfile);
//router.get("update/me", verifyToken, updateProfile);
router.delete("/:id", verifyToken, verifyRole("admin"), deleteUser);

export default router;
