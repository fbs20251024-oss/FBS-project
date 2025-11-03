import mongoose from "mongoose";

const facilitySchema = new mongoose.Schema(
  {
    facilityName: {
      type: String, required: true, unique: true, trim: true,
      minlength: [3, "Facility name must be at least 3 characters long"],
      maxlength: [30, "Facility name cannot exceed 30 characters"],
    },
    description: {
      type: String, required: true,
      minlength: [3, "Description must be at least 3 characters long"],
    },
    facilityStatus: {
      type: String, default: "open", enum: {
        values: ["open", "close"],
        message: "{VALUE} is not a valid status"
      },
    }
  },
  { timestamps: true }
)
facilitySchema.index({ facilityName: 1, facilityStatus: 1 });

export default mongoose.model("Facility", facilitySchema);
