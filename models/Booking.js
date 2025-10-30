import mongoose from "mongoose";

const bookSchema = new mongoose.Schema(
  {
    userid: { type: String, required: true }, // from user._id
    facilityid: { type: String, required: true }, // from facilitiy._id
    date: { type: String, required: true }, // YYYY-MM-DD
    session: { type: String, enum: ["am", "pm"] },
    bookingStatus: { type: String, default: "normal", enum: ["normal", "cancel", "complete"] }
  },
  { timestamps: true }
)


module.exports = mongoose.model("Booking", bookSchema);
