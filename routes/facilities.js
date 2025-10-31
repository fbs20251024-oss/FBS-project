import express from "express";
import {
  createFacility,
  getFacility,
  updateFacility,
  deleteFacility,
} from "../controllers/facilityController.js";

const router = express.Router();


router.post("/", createFacility);
router.get("/", getFacility);
router.get("/:id", getFacility);
router.put("/:id", updateFacility);
router.delete("/:id", deleteFacility);

export default router;
