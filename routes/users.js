import express from "express";
import { verifyRole, verifyToken } from "../middleware/authMiddleware.js";
import {
  getUsers,
  getProfile,
  updateProfile,
  deleteUser,
} from "../controllers/userController.js";

const router = express.Router();

router.get("/", verifyToken, verifyRole("admin"), getUsers);
router.get("/me", verifyToken, getProfile);
router.get("/:id", verifyToken, verifyRole("admin"), getProfile);
router.put("/", verifyToken, updateProfile);
router.put("/:id", verifyToken, verifyRole("admin"), updateProfile);
router.delete("/:id", verifyToken, verifyRole("admin"), deleteUser);

export default router;
