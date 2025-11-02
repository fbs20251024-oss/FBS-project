import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    facility: { type: mongoose.Schema.Types.ObjectId, ref: 'Facility', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, required: true }, // YYYY-MM-DD
    session: { type: String, enum: ["am", "pm"], required: true },
    bookingStatus: { type: String, default: "normal", enum: ["normal", "cancel", "complete"] }
  },
  { timestamps: true }
)
bookingSchema.index(
  { facility: 1, date: 1, session: 1 },
  { unique: true, partialFilterExpression: { bookingStatus: { $ne: "cancel" } } }
);

export default mongoose.model("Booking", bookingSchema);
