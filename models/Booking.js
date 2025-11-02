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

bookingSchema.pre('save', async function (next) {
  const [User, Facility] = [mongoose.model('User'), mongoose.model('Facility')];
  const [userExists, facilityExists] = await Promise.all([
    User.exists({ _id: this.user }),
    Facility.exists({ _id: this.facility })
  ]);
  if (!userExists) return next(new Error('Referenced user does not exist.'));
  if (!facilityExists) return next(new Error('Referenced facility does not exist.'));
  next();
});

export default mongoose.model("Booking", bookingSchema);
