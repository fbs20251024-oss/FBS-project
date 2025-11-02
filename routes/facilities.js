import express from "express";
import { verifyRole, verifyToken } from "../middleware/authMiddleware.js";
import {
  createFacility,
  getFacility,
  updateFacility,
  deleteFacility,
} from "../controllers/facilityController.js";

const router = express.Router();

router.post("/", verifyToken, verifyRole("admin"), createFacility); // admin
router.get("/", verifyToken, getFacility);
router.get("/:id", verifyToken, getFacility);
router.put("/:id", verifyToken, verifyRole("admin"), updateFacility); // admin
router.delete("/:id", verifyToken, verifyRole("admin"), deleteFacility); // admin

export default router;
