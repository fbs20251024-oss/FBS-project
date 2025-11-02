import express from "express";
import { verifyRole, verifyToken } from "../middleware/authMiddleware.js";
import {
  createFacility,
  getFacility,
  updateFacility,
  deleteFacility,
} from "../controllers/facilityController.js";

const router = express.Router();

router.post("/", createFacility); // admin
router.get("/", getFacility);
router.get("/:id", getFacility);
router.put("/:id", updateFacility); // admin
router.delete("/:id", deleteFacility); // admin

export default router;
