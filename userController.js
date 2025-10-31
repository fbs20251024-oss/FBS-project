import User from "../models/User.js";
import bcrypt from "bcryptjs";

export const getUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 2;
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

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching profile:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

//API for Updating User Profile
export const updateProfile = async (req, res) =>{
  try {
    const userId = req.user?.id; // 從JWT解碼結果取得user id
    if (!userId){
      return res.status(401).json({ success: false, msg: 'Unauthorized: No user logged in' });
        };

    const {username, email, password} = req.body;

    if (!email && !password) { 
            return res.status(400).json({
                success:false, msg: "Please enter correct update information"
            });
        };      

    //Const UpdateFields
    const updateFields = {};
    if(username) updateFields.username = username;
    if(email) updateFields.email = email;
    if(password) { //Handle Password
      const hashedPassword = await bcrypt.hash(password, 10);
      updateFields.password = hashedPassword;
      };

    const updateProfile = await User.findByIdAndUpdate(userId,{$set: updateFields},{new:true});

    if (! updateProfile) {
            return res.status(404).json({
                success:false, msg: "Profile not found"
                });
        };
    
  } catch (error) {
    console.error("Error updating profile:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

//API for Admin to Update User Profile (Password not included)
export const adminUpdateProfile = async (req, res) =>{
  try {
    const adminRole = req.user?.role; // 從JWT解碼結果取得user role
    if (!adminRole || adminRole !== 'admin'){
      return res.status(401).json({ success: false, msg: 'Access denied' });
        };

    const {username, email, role} = req.body;
    const userId = req.params.id;

    if (!username && !email && !password) { 
            return res.status(400).json({
                success:false, msg: "Please enter correct update information"
            });
    };      

    //Const UpdateFields
    const updateFields = {};
    if(username) updateFields.username = username;
    if(email) updateFields.email = email;
    if(role) {
      if(!['user', 'admin'].includes(role)){
        return res.status(400).json({ success: false, msg: 'Invalid role' });
      }
      updateFields.role = role;
    };

    if (Object.keys(updateFields).length === 0) {
      return res.status(400).json({ success: false, msg: 'Nothing to update' });
    }

    const updateProfile = await User.findByIdAndUpdate(userId,{$set: updateFields},{new:true});

    if (! updateProfile) {
            return res.status(404).json({
                success:false, msg: "Profile not found"
                });
        };
    
  } catch (error) {
    console.error("Error updating profile:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
