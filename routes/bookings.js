import express from "express";
import {
  addBooking,
  getBooking,
  updateBooking,
  deleteBooking,
} from "../controllers/bookingController.js";

const router = express.Router();

router.post("/", addBooking);
router.get("/:id", getBooking);
router.get("/user/:id", getBooking);
router.get("/facility/:id", getBooking);
router.put("/:id", updateBooking);
router.delete("/:id", deleteBooking);

export default router;