import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    facility: {
      type: mongoose.Schema.Types.ObjectId, ref: 'Facility', required: true,
      validate: {
        validator: async function (id) {
          return await mongoose.model('Facility').exists({ _id: id });
        },
        message: 'Referenced facility does not exist.'
      }
    },
    user: {
      type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true,
      validate: {
        validator: async function (id) {
          return await mongoose.model('User').exists({ _id: id });
        },
        message: 'Referenced user does not exist.'
      }
    },
    date: { type: Date, required: true },
    session: {
      type: String, required: true, enum: {
        values: ["am", "pm"],
        message: "{VALUE} is not a valid session"
      }
    },
    bookingStatus: {
      type: String, default: "normal", enum: {
        values: ["normal", "cancel", "complete"],
        message: "{VALUE} is not a valid status"
      },
    }
  },
  { timestamps: true }
)
bookingSchema.index({ user: 1, date: 1 });
bookingSchema.index(
  { facility: 1, date: 1, session: 1 },
  { unique: true, partialFilterExpression: { bookingStatus: { $ne: "cancel" } } }
);


export default mongoose.model("Booking", bookingSchema);
