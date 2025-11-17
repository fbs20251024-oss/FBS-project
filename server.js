import express from "express";

import dotenv from "dotenv";

import cookieParser from "cookie-parser";

import cors from "cors";

import { connectDB } from "./config/db.js";
import authRoutes from "./routes/auth.js";
import bookingRoutes from "./routes/bookings.js";
import facilityRoutes from "./routes/facilities.js";
import userRoutes from "./routes/users.js";

dotenv.config();

const PORT = process.env.PORT || 5000;
const app = express();

connectDB();

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173", // Adjust this to your frontend URL
    credentials: true,
  })
);
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/facilities", facilityRoutes);
app.use("/api/bookings", bookingRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
