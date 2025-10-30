import mongoose from "mongoose";

const facilitySchema = new mongoose.Schema(
  {
    facilityName: { type: String, required: true},
    description: { type: String, required: true},
    facilityStatus: { type: String, default: "open", enum: ["open", "close"]}
  },
  { timestamps: true}
)

export default mongoose.model("Facility", facilitySchema);