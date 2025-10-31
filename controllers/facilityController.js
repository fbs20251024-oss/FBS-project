import Facility from "../models/Facility.js";

export const createFacility = async (req, res) => {
  const { facility: { facilityName, description } } = req.body;

  if (!facilityName || !description) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const existingFacility = await Facility.findOne({ facilityName });
    if (existingFacility) {
      return res.status(400).json({ message: "Facility already exists" });
    }

    const facility = new Facility({
      facilityName,
      description,
    });
    await facility.save();
    res.status(201).json({
      message: "Facility created successfully",
      facility: {
        id: facility._id,
        facilityName: facility.facilityName,
        description: facility.description,
        facilityStatus: facility.facilityStatus,
      },
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
        facilities,
        total,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
      });
    } catch (error) {
      console.error("Error fetching facilities:", error);
      return res.status(500).json({ message: "Server error" });
    }
  }
};

export const updateFacility = async (req, res) => {
  const { facility: { facilityName, description, facilityStatus } } = req.body;
  try {
    const facility = await Facility.findById(req.params.id);
    if (!facility) {
      return res.status(404).json({ message: "Facility not found" });
    }
    if (facilityName) facility.facilityName = facilityName;
    if (description) facility.description = description;
    if (facilityStatus) facility.facilityStatus = facilityStatus;
    await facility.save();

    res.status(200).json({
      message: "Facility updated successfully",
      facility,
    });
  } catch (error) {
    console.error("Error updating facility:", error);
    return res.status(500).json({ message: "Server error" });
  }
}

export const deleteFacility = async (req, res) => {
  try {
    const facility = await Facility.findById(req.params.id);
    if (!facility) {
      return res.status(404).json({ message: "Facility not found" });
    }
    await Facility.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Facility deleted successfully" });
  } catch (error) {
    console.error("Error deleting facility:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
