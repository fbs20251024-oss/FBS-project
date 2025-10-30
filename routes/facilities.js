import express from "express";
import {
  createFacility,
  deleteFacility,
  getFacility,
  getFacilities,
} from "../controllers/facilityController.js";

const router = express.Router();


router.get("/create", createFacility);
router.get("/", getFacilities);
router.get("/:id", getFacility);
//router.get("/update/:id", updateFacility);
router.delete("/delete/:id", deleteFacility);

export default router;
