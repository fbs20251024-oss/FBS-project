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
    const user = await User.findById(req.user.id).select("-password");
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
    // const { user: {}}
    let userId = req.user?.id; // 從JWT解碼結果取得user id

    if (req.path.includes("me")) userId = req.params.id;

    if (!userId) {
      return res.status(401).json({ success: false, msg: 'Unauthorized: No user logged in' });
    };

    const { user: { username, email, password, role } } = req.body;
    //Const UpdateFields
    const updateFields = {};
    if (username) updateFields.username = username;
    if (password) { //Handle Password
      const hashedPassword = await bcrypt.hash(password, 10);
      updateFields.password = hashedPassword;
    };
    if (req.user?.role === "admin") {
      if (email) updateFields.email = email;
      if (role) {
        if (!['user', 'admin', 'na'].includes(role)) {
          return res.status(400).json({ success: false, msg: 'Invalid role' });
        }
        updateFields.role = role;
      }
    };

    const updateProfile = await User.findByIdAndUpdate(userId, { $set: updateFields }, { new: true });

    if (!updateProfile) {
      return res.status(404).json({
        success: false, msg: "Profile not found"
      });
    };

    res.status(200).json({ success: true, updateProfile });

  } catch (error) {
    console.error("Error updating profile:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user.role === "admin") {
      return res.status(403).json({ message: "Cannot delete admin users" });
    }
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
