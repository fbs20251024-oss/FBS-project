import mongoose from "mongoose";

const bookSchema = new mongoose.Schema(
  {
    facilityId: { type: String, required: true }, // from facilitiy._id
    userId: { type: String, required: true }, // from user._id
    date: { type: String, required: true }, // YYYY-MM-DD
    session: { type: String, enum: ["am", "pm"] },
    bookingStatus: { type: String, default: "normal", enum: ["normal", "cancel", "complete"] }
  },
  { timestamps: true }
)

export default mongoose.model("Booking", bookSchema);