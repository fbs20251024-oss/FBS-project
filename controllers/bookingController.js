import Booking from "../models/Booking.js";

export const addBooking = async (req, res) => {
    const { booking: { facilityId, userId, date, session } } = req.body;

    if (!facilityId || !userId || !date || !session) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        const existingBooking = await Booking.findOne({ facility: facilityId, date, session });
        if (existingBooking) {
            return res.status(400).json({ message: "Booking already exists" });
        }

        const booking = new Booking({
            facility: facilityId,
            user: userId,
            date,
            session
        });
        await booking.save();

        const newBooking = await Booking.findOne(booking._id)
            .populate("user", "username")
            .populate("facility", "facilityName");

        res.status(201).json({
            message: "Booking created successfully",
            newBooking,
        });
    } catch (error) {
        console.error("Error creating booking", error);
        return res.status(500).json({ message: "Server error" });
    }
};

export const getBooking = async (req, res) => {
    if (req.path.includes("/user/") || req.path.includes("/facility/")) {
        try {
            let query = {};

            if (req.path.includes("/user/")) {
                query.user = req.params.id;
            } else if (req.path.includes("/facility/")) {
                query.facility = req.params.id;
            }

            const bookings = await Booking.find(query)
                .populate("user", "username")
                .populate("facility", "facilityName");

            if (!bookings || bookings.length === 0) {
                return res.status(404).json({ message: "Booking not found" });
            }
            const total = bookings.length;
            res.status(200).json({ bookings, total });
        } catch (error) {
            console.error("Error fetching booking:", error);
            return res.status(500).json({ message: "Server error" });
        }
    } else {
        try {
            const booking = await Booking.findById(req.params.id)
                .populate("user", "username")
                .populate("facility", "facilityName");

            if (!booking || booking.length === 0) {
                return res.status(404).json({ message: "Booking not found" });
            }
            res.status(200).json({ booking });
        } catch (error) {
            console.error("Error fetching booking:", error);
            return res.status(500).json({ message: "Server error" });
        }
    }
};

export const updateBooking = async (req, res) => {
    const { booking: { date, session, bookingStatus } } = req.body;

    try {
        const booking = await Booking.findById(req.params.id)
            .populate("user", "username")
            .populate("facility", "facilityName");

        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        const facilityId = booking.facility._id;

        const existingBooking = await Booking.findOne({
            facility: facilityId, date, session, _id: { $ne: booking._id }
        });
        if (existingBooking) {
            return res.status(400).json({ message: "Booking already exists" });
        }

        if (date) booking.date = date;
        if (session) booking.session = session;
        if (bookingStatus) booking.bookingStatus = bookingStatus;
        await booking.save();

        res.status(200).json({
            message: "Booking updated successfully",
            booking,
        });
    } catch (error) {
        console.error("Error updating booking", error);
        return res.status(500).json({ message: "Server error" });
    }
};

