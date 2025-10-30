import Booking from "../models/Booking.js";

export const addBooking = async (req, res) => {
    const { facilityId, userId, date, session } = req.body;

    if (!facilityId || !userId || !date || !session) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        const existingBooking = await Booking.findOne({ facilityId, date, session });
        if (existingBooking) {
            return res.status(400).json({ message: "Booking already exists" });
        }

        const booking = new Booking({
            facilityId,
            userId,
            date,
            session
        });
        await booking.save();
        res.status(201).json({
            message: "Booking created successfully",
            booking: {
                id: booking._id,
                facilityId: booking.facilityId,
                userId: booking.userId,
                date: booking.date,
                session: booking.session,
                bookingStatus: booking.bookingStatus,
            },
        });
    } catch (error) {
        console.error("Error creating booking", error);
        return res.status(500).json({ message: "Server error" });
    }
};

export const getBookings = async (req, res) => {
        try {
        let bookings;

        if (req.path.includes("/user/")) {
            bookings = await Booking.find({ userId: req.params.id });
        } else if (req.path.includes("/facility/")) {
            bookings = await Booking.find({ facilityId: req.params.id });
        }
        if (!bookings || bookings.length === 0) {
            return res.status(404).json({ message: "Booking not found" });
        }

        res.status(200).json(bookings);
    } catch (error) {
        console.error("Error fetching booking:", error);
        return res.status(500).json({ message: "Server error" });
    }
};