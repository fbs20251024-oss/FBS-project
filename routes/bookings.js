import express from "express";
import {
  addBooking,
  getBookings,

} from "../controllers/bookingController.js";

const router = express.Router();

router.get("/add", addBooking);
router.get("/user/:id", getBookings);
router.get("/facility/:id", getBookings);
//router.get("/:id", getBooking);
//router.get("/update/:id", updateBooking);
//router.delete("/delete/:id", deleteBooking);

export default router;