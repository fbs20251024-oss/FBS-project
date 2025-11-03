import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String, required: true, trim: true,
      minlength: [3, "Username must be at least 3 characters long"],
      maxlength: [30, "Username cannot exceed 30 characters"],
      match: [/^[a-zA-Z0-9._]+$/, "Username may only contain letters, numbers, underscores, and dots"]
    },
    email: {
      type: String, required: true, unique: true, index: true, lowercase: true,
      validate: {
        validator: function (v) { return /^\S+@\S+\.\S+$/.test(v); },
        message: props => `${props.value} is not a valid email!`
      }
    },
    password: { type: String, required: true },
    role: {
      type: String, default: "user", enum: {
        values: ["user", "admin", "na"], message: "{VALUE} is not a valid role"
      },
    },
  },
  { timestamps: true }
);
userSchema.pre("save", async function (next) {
  if (!this.isModified("password") || this.password.startsWith("$2b$")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});
userSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model("User", userSchema);
