import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true},
    password: { type: String, required: true },
    role: { type: String, default: "user", enum: ["user", "admin", "na"] }
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
