import mongoose from "mongoose";

const facilitySchema = new mongoose.Schema(
  {
    facilityName: { type: String, required: true, unique: true},
    description: { type: String, required: true },
    facilityStatus: { type: String, default: "open", enum: ["open", "close"] }
  },
  { timestamps: true }
)
facilitySchema.index({ facilityName: 1, facilityStatus: 1 });

export default mongoose.model("Facility", facilitySchema);
