import express from "express";
import { verifyRole, verifyToken } from "../middleware/authMiddleware.js";
import {
  deleteUser,
  getProfile,
  getUsers,
  updateProfile,
  adminUpdateProfile
} from "../controllers/userController.js";

const router = express.Router();

router.get("/", verifyToken, verifyRole("admin"), getUsers);
router.get("/me", verifyToken, getProfile);
router.put("/update/me", verifyToken, updateProfile);
router.put("/update/:id", verifyToken,verifyRole("admin"), adminUpdateProfile);
router.delete("/:id", verifyToken, verifyRole("admin"), deleteUser);

export default router;
