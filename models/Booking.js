import mongoose from "mongoose";

const bookSchema = new mongoose.Schema(
  {
    facility: { type: mongoose.Schema.Types.ObjectId, ref: 'Facility' },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    date: { type: String, required: true }, // YYYY-MM-DD
    session: { type: String, enum: ["am", "pm"] },
    bookingStatus: { type: String, default: "normal", enum: ["normal", "cancel", "complete"] }
  },
  { timestamps: true }
)

export default mongoose.model("Booking", bookSchema);