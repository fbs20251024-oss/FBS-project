import Booking from "../models/Booking.js";

function isValidDate(dateString) { // can put at util.js
  const date = new Date(dateString);
  const today = new Date();
  // Clear time portion for accurate comparison
  today.setHours(0, 0, 0, 0);
  date.setHours(0, 0, 0, 0);
  return !isNaN(date.getTime()) && date >= today;
}

export const addBooking = async (req, res) => {
  const { facilityId, date, session } = req.body.booking || {};
  const userId = req.body.booking.userId || req.user?.id;
  if (!facilityId || !userId || !date || !session) {
    return res.status(400).json({ message: "All fields are required" });
  }
  if (!isValidDate(date)) {
    return res.status(400).json({ message: "Date must be today or later" });
  }
  try {
    const existingBooking = await Booking.findOne({
      facility: facilityId, date, session, bookingStatus: { $ne: "cancel" }
    });
    if (existingBooking) {
      return res.status(409).json({ message: "Booking already exists" });
    }
    let booking = new Booking({
      facility: facilityId, user: userId, date, session
    });
    await booking.save();
    booking = await Booking.findById(booking._id)
      .populate("user", "username")
      .populate("facility", "facilityName");
    res.status(201).json({
      message: "Booking created successfully", booking,
    });
  } catch (error) {
    console.error("Error creating booking", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getBooking = async (req, res) => {
  const { path, params } = req;
  const query = {};
  const isUserRoute = path.includes("/user");
  const isFacilityRoute = path.includes("/facility");
  if (isUserRoute) query.user = params.id;
  else if (isFacilityRoute) query.facility = params.id;
  else query._id = params.id;
  try {
    const booking = isUserRoute || isFacilityRoute
      ? await Booking.find(query)
      : await Booking.findOne(query);
    const isEmpty = Array.isArray(booking) ? booking.length === 0 : !booking;
    if (isEmpty) {
      return res.status(404).json({ message: isUserRoute || isFacilityRoute ? "No Booking found" : "Booking not found" });
    }
    let role = req.user?.role; // admin
    const populateFields = [
      ...(role === "admin" ? [{ path: "user", select: "username" }] : []),
      { path: "facility", select: "facilityName" },
    ];
    const populatedBooking = await Booking.populate(booking, populateFields);
    const response = isUserRoute || isFacilityRoute
      ? { bookings: populatedBooking, total: populatedBooking.length }
      : { booking: populatedBooking };
    res.status(200).json(response);
  } catch (error) {
    console.error("Error fetching booking:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const updateBooking = async (req, res) => {
  const { date, session, bookingStatus } = req.body.booking || {};
  if (!isValidDate(date)) {
    return res.status(400).json({ message: "Date must be today or later" });
  }
  let role = req.user?.role; // admin
  if (bookingStatus === "complete" && role !== "admin") {
    return res.status(400).json({ success: false, message: 'Invalid role' });
  }
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("user", "username")
      .populate("facility", "facilityName");
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    const facilityId = booking.facility._id;
    const existingBooking = await Booking.findOne({
      facility: facilityId, date, session, bookingStatus: { $ne: "cancel" }
    });
    if (existingBooking) {
      return res.status(409).json({ message: "Booking already exists" });
    }
    if (bookingStatus) booking.bookingStatus = bookingStatus;
    else {
      if (date) booking.date = date;
      if (session) booking.session = session;
    }
    await booking.save();
    res.status(200).json({
      message: "Booking updated successfully", booking,
    });
  } catch (error) {
    console.error("Error updating booking", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    res.status(200).json({ message: "Booking deleted successfully" });
  } catch (error) {
    console.error("Error deleting booking:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
