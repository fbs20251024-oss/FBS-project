import express from "express";

import {
  addBooking,
  getBooking,
  updateBooking,
  deleteBooking,
} from "../controllers/bookingController.js";
import { verifyRole, verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", verifyToken, addBooking);
router.get("/user/:id", verifyToken, getBooking);
router.get("/facility/:id", verifyToken, getBooking);
router.get("/:id", verifyToken, getBooking);
router.put("/:id", verifyToken, updateBooking);
router.delete("/:id", verifyToken, verifyRole("admin"), deleteBooking);

export default router;
