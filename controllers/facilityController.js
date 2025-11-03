import Facility from "../models/Facility.js";

const isFacilityNameTaken = async (name, currentId = null) => { // can put at util.js
  const existing = await Facility.findOne({ facilityName: name }).lean();
  return existing && existing._id.toString() !== currentId;
};

export const createFacility = async (req, res) => {
  const { facilityName, description } = req.body.facility || {};
  if (!facilityName || !description) {
    return res.status(400).json({ message: "All fields are required" });
  }
  try {
    if (await isFacilityNameTaken(facilityName)) {
      return res.status(409).json({ success: false, message: "Facility Name already in use" });
    }
    const facility = new Facility({ facilityName, description, });
    await facility.save();
    res.status(201).json({
      message: "Facility created successfully", facility,
    });
  } catch (error) {
    console.error("Error creating facility:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getFacility = async (req, res) => {
  if (req.params.id) {
    try {
      const facility = await Facility.findById(req.params.id);
      if (!facility) {
        return res.status(404).json({ message: "Facility not found" });
      }
      res.status(200).json({ facility });
    } catch (error) {
      console.error("Error fetching facility detail:", error);
      return res.status(500).json({ message: "Server error" });
    }
  } else {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 2;
      const skip = (page - 1) * limit;
      const total = await Facility.countDocuments();
      const facilities = await Facility.find().skip(skip).limit(limit);
      res.status(200).json({
        facilities, total, totalPages: Math.ceil(total / limit), currentPage: page,
      });
    } catch (error) {
      console.error("Error fetching facilities:", error);
      return res.status(500).json({ message: "Server error" });
    }
  }
};

export const updateFacility = async (req, res) => {
  const { facilityName, description, facilityStatus } = req.body.facility || {};
  const { id } = req.params;
  try {
    const facility = await Facility.findById(id);
    if (!facility) {
      return res.status(404).json({ message: "Facility not found" });
    }
    if (facilityStatus) facility.facilityStatus = facilityStatus;
    else {
      if (facilityName && await isFacilityNameTaken(facilityName, id)) {
        return res.status(409).json({ success: false, message: "Facility Name already in use" });
      }
      if (facilityName) facility.facilityName = facilityName;
      if (description) facility.description = description;
    }
    await facility.save();
    res.status(200).json({
      message: "Facility updated successfully", facility,
    });
  } catch (error) {
    console.error("Error updating facility:", error);
    return res.status(500).json({ message: "Server error" });
  }
}

export const deleteFacility = async (req, res) => {
  try {
    const facility = await Facility.findByIdAndDelete(req.params.id);
    if (!facility) {
      return res.status(404).json({ message: "Facility not found" });
    }
    res.status(200).json({ message: "Facility deleted successfully" });
  } catch (error) {
    console.error("Error deleting facility:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
