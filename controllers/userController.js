import User from "../models/User.js";
import bcrypt from "bcryptjs";

export const getUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;
    const total = await User.countDocuments();
    const users = await User.find().skip(skip).limit(limit).select("-password");
    res.status(200).json({
      users,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getProfile = async (req, res) => {
  try {
    const userId = req.params.id || req.user.id;
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ user });
  } catch (error) {
    console.error("Error fetching profile:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

//API for Updating User Profile
export const updateProfile = async (req, res) => {
  try {
    const userId = req.params.id || req.user.id; // 從JWT解碼結果取得user id
    const { username, email, password, role } = req.body.user || {};
    //Const UpdateFields
    const updateFields = {};
    if (username) updateFields.username = username;
    if (password) { //Handle Password
      const hashedPassword = await bcrypt.hash(password, 10);
      updateFields.password = hashedPassword;
    };
    if (req.user.role === "admin" && req.params.id) {
      if (email) {
        const existing = await User.findOne({ email }).lean();
        if (existing && existing._id.toString() !== userId) {
          return res.status(409).json({ success: false, message: "Email already in use" });
        }
        updateFields.email = email;
      }
      if (role) {
        if (!['user', 'admin', 'na'].includes(role)) {
          return res.status(400).json({ success: false, message: 'Invalid role' });
        }
        updateFields.role = role;
      }
      console.log(`Admin ${req.user.id} updated user ${req.params.id}`);
    };
    if (Object.keys(updateFields).length === 0) {
      return res.status(400).json({ success: false, message: "No valid fields provided for update" });
    }

    const updateUser = await User.findByIdAndUpdate(userId, { $set: updateFields }, { new: true });

    if (!updateUser) {
      return res.status(404).json({
        success: false, message: "Profile not found"
      });
    };

    res.status(200).json({ success: true, updateUser });

  } catch (error) {
    console.error("Error updating profile:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const deleteUser = async (req, res) => {
  try {
    if (user.role === "admin") {
      return res.status(403).json({ message: "Cannot delete admin users" });
    }
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
