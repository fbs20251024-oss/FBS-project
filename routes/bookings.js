import express from "express";
import { verifyRole, verifyToken } from "../middleware/authMiddleware.js";
import {
  addBooking,
  getBooking,
  updateBooking,
  deleteBooking,
} from "../controllers/bookingController.js";

const router = express.Router();

router.post("/", verifyToken, addBooking);
router.get("/:id", verifyToken, getBooking);
router.get("/user/:id", verifyToken, getBooking);
router.get("/facility/:id", verifyToken, getBooking);
router.put("/:id", verifyToken, updateBooking);
router.delete("/:id", verifyToken, verifyRole("admin"), deleteBooking); // admin

export default router;
