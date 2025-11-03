import User from "../models/User.js";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  const { username, email, password } = req.body.user || {};
  if (!username || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }
  try {
    const existingUser = await User.findOne({ email }).lean();
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }
    const user = new User({ username, email, password });
    await user.save();
    res.status(201).json({
      message: "User registered successfully", user,
    });
  } catch (error) {
    console.error("Error registering user:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body.user || {};
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });
    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });
    const accessToken = jwt.sign(
      { id: user._id, role: user.role, }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "30m", }
    );
    const refreshToken = jwt.sign(
      { id: user._id, role: user.role, }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "7d", }
    );
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true, secure: process.env.NODE_ENV === "production",
      sameSite: "strict", maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    res.status(200).json({ accessToken, user, });
  } catch (error) {
    console.error("Error logging in user:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const refreshToken = async (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) {
    return res.status(401).json({ message: "No refresh token provided" });
  }
  try {
    const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    const newAccessToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.ACCESS_TOKEN_SECRET, { expiresIn: "30m" }
    );
    res.status(200).json({
      accessToken: newAccessToken,
      user: { id: user._id, username: user.username, email: user.email, role: user.role, },
    });
  } catch (error) {
    console.error("Error refreshing token:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const logout = (req, res) => {
  try {
    res.clearCookie("refreshToken", {
      httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict",
    });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Error logging out user:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
